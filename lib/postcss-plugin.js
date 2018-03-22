'use strict';
const postcss = require('postcss');
const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');

const urlRegexp = new RegExp('url\\s*\\((\\s*"([^"]+)"|\'([^\']+)\'|([^\'")]+))\\)');

/**
 * Turn `url("demo.svg")` into `demo.svg`
 */
function getUnresolvedIconPath (value) {
  const relativePathResult = urlRegexp.exec(value);
  if (!relativePathResult) {
    throw new Error(`Could not parse url "${value}".`);
  }
  return relativePathResult[2] || relativePathResult[3] || relativePathResult[4];
}

function parseFontIconValue (value) {
  const valueParts = value.trim().split(' ');
  const result = {};
  // Just a url
  // font-icon: url('./demo.svg');
  if (valueParts.length === 1) {
    result.url = getUnresolvedIconPath(valueParts[0]);
  }
  // Font size and url
  // font-icon: 20px url('./demo.svg');
  if (valueParts.length === 2) {
    result.size = valueParts[0];
    result.url = getUnresolvedIconPath(valueParts[1]);
  }
  return result;
}

/**
 * Returns a promise with the result of all `icon-font:url(...)` svg paths of the given file
 *
 * @param fontName {string} The name of the font (font-family)
 * @param resolve {function} The webpack resolve helper
 * @param resolvedSvgs {string} The css loader path context to resolve relative urls
 */
function getSvgPaths (postCssRoot, webpackResolve, context) {
  // Gather all font-icon urls:
  let unresolvedPaths = [];
  postCssRoot.walkDecls((decl) => {
    if (decl.prop === 'font-icon') {
      const fontIcon = parseFontIconValue(decl.value);
      unresolvedPaths.push(fontIcon.url);
    }
  });
  // Remove duplicates
  unresolvedPaths = _.uniq(unresolvedPaths);
  // Resolve the urls to the absolute url
  return Promise.all(unresolvedPaths.map((unresolvedPath) =>
    new Promise((resolve, reject) => {
      webpackResolve(context, unresolvedPath, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    })
  ))
    .then((resolvedFilenames) => ({
    // Original paths (unprocessed relative to the current css file context)
      unresolved: unresolvedPaths,
      // Absolute paths
      resolved: resolvedFilenames,
      // Relative unix paths (to the cwd)
      relative: resolvedFilenames.map(
        (resolvedPath) => path.relative('.', resolvedPath).replace(new RegExp('\\' + path.sep, 'g'), '/')
      )
    }));
}

/**
 * @param fontName {string} The name of the font (font-family)
 * @param postCssRoot {object} The postCss root object
 * @param svgPaths {object} The svg path information
 */
function replaceIconFontDeclarations (fontName, postCssRoot, svgPaths) {
  postCssRoot.walkDecls((decl) => {
    if (decl.prop === 'font-icon') {
      const fontIcon = parseFontIconValue(decl.value);
      // Add the font name
      decl.cloneBefore({
        prop: 'text-rendering',
        value: 'auto'
      });
      decl.cloneBefore({
        prop: '-webkit-font-smoothing',
        value: 'auto'
      });
      decl.cloneBefore({
        prop: '-moz-osx-font-smoothing',
        value: 'auto'
      });
      // If a font size is set we can use the font shorthand
      if (fontIcon.size) {
        decl.cloneBefore({
          prop: 'font',
          value: `normal normal normal ${fontIcon.size}/1 ${fontName}`
        });
      }
      // If no font size is set we use the font attributes
      if (!fontIcon.size) {
        decl.cloneBefore({
          prop: 'font-family',
          value: fontName
        });
        decl.cloneBefore({
          prop: 'font-weight',
          value: 'normal'
        });
      }
      // Look up the index of the svg in the array to generate the unicode char position
      const iconCharCode = svgPaths.unresolved.indexOf(getUnresolvedIconPath(decl.value));
      decl.value = '\'\\e' + _.padStart(iconCharCode.toString(16), 3, '0') + '\'';
      // Turn `font-icon:` into `content:`
      decl.prop = 'content';
    }
  });
}

/**
 * @param fontName {string} The name of the font (font-family)
 * @param postCssRoot {object} The postCss root object
 * @param useCssModules {boolean} wether the css loader is using css-modules or not
 * @param resolvedRelativeSvgs {object} The svg path information
 */
function addFontDeclaration (fontName, postCssRoot, useCssModules, svgPaths) {
  // The options are passed as a query string so we use the relative svg paths to reduce the path length per file
  const options = { svgs: svgPaths.relative, name: fontName };
  // Use ~ to tell the loader-utils of the css loader that this is a webpack path
  // Unfortunately this works only if the css-loader is not using css modules
  const prefix = useCssModules ? '' : '~';
  // Use !! to tell webpack that we don't want any other loader to kick in
  const url = prefix + '!!iconfont-webpack-plugin/lib/loader.js?' + JSON.stringify(options) + '!iconfont-webpack-plugin/placeholder.svg';
  postCssRoot.prepend(postcss.parse(
    '@font-face { ' +
    'font-family: ' + fontName + '; src:url(\'' + url + '\') format(\'woff\');' +
    'font-weight: normal;' +
    'font-style: normal;' +
    '}'
  ));
}

/**
 * PostCSS Plugin factory
 */
module.exports = postcss.plugin('iconfont-webpack', config => function (root, result) {
  const cssFilename = result.opts.from;
  const context = path.dirname(cssFilename);
  return getSvgPaths(root, config.resolve, context)
    .then(function (svgPaths) {
      // Stop if the css file contains no `font-icon:url('..');` declarations
      if (svgPaths.resolved.length === 0) {
        return;
      }
      // Generate a font icon name
      const md5sum = crypto.createHash('md5');
      md5sum.update(JSON.stringify(_.values(svgPaths.relative)));
      let fontName = md5sum.digest('hex').substr(0, 6);
      // Prefix the fontname with a letter as fonts with a leading number are not allowed
      fontName = config.fontNamePrefix + String.fromCharCode(fontName.charCodeAt(0) + 20) + fontName.substr(1);
      // Update the css
      return Promise.all([
        addFontDeclaration(fontName, root, config.modules, svgPaths),
        replaceIconFontDeclarations(fontName, root, svgPaths)
      ]);
    });
});
