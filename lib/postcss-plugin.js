// @ts-check
'use strict';
const postcss = require('postcss');
const path = require('path');
const crypto = require('crypto');

const urlRegexp = new RegExp('url\\s*\\((\\s*"([^"]+)"|\'([^\']+)\'|([^\'")]+))\\)');

/** @typedef {{resolved: string[], unresolved: string[], relative: string[]}} SvgPaths */

/**
 * Turn `url("demo.svg")` into `demo.svg`
 * @param value {string}
 */
function getUnresolvedIconPath (value) {
  const relativePathResult = urlRegexp.exec(value);
  if (!relativePathResult) {
    throw new Error(`Could not parse url "${value}".`);
  }
  return relativePathResult[2] || relativePathResult[3] || relativePathResult[4];
}

/**
 * Parses a `font-icon: url('./demo.svg')` expression
 *
 * @param value {string}
 * @returns {{url: string, size?: string}}
 */
function parseFontIconValue (value) {
  const valueParts = value.trim().split(' ');
  const result = {};
  // Parse font size and url
  // font-icon: 20px url('./demo.svg');
  if (valueParts.length === 2) {
    result.size = valueParts[0];
  }
  // The url is always the last part
  // font-icon: url('./demo.svg');
  // font-icon: 20px url('./demo.svg);
  result.url = getUnresolvedIconPath(valueParts[valueParts.length - 1]);
  return result;
}

/**
 * Returns a promise with the result of all `icon-font:url(...)` svg paths of the given file
 *
 * @param postCssRoot {postcss.Root} The name of the font (font-family)
 * @param webpackResolve {(context: string, path: string, callback: (err: any, result: string) => void) => void} The webpack resolve helper
 * @param context {string} The css loader path context to resolve relative urls
 *
 * @returns {Promise<{resolved: string[], unresolved: string[], relative: string[]}>}
 */
function getSvgPaths (postCssRoot, webpackResolve, context) {
  // Gather all font-icon urls:
  const unresolvedPathsSet = new Set();
  postCssRoot.walkDecls((decl) => {
    if (decl.prop === 'font-icon' || decl.prop === 'font-icon-glyph') {
      const fontIcon = parseFontIconValue(decl.value);
      unresolvedPathsSet.add(fontIcon.url);
    }
  });
  // Remove duplicates
  const unresolvedPaths = Array.from(unresolvedPathsSet);
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
 * @param postCssRoot {postcss.Root} The postCss root object
 * @param svgPaths {SvgPaths} The svg path information
 */
function replaceIconFontDeclarations (fontName, postCssRoot, svgPaths) {
  postCssRoot.walkDecls((decl) => {
    // Add font icon styles
    // + text-rendering
    // + -webkit-font-smoothing
    if (decl.prop === 'font-icon') {
      // Add font smoothing
      // Similar to font Awesome
      // https://github.com/FortAwesome/Font-Awesome/blob/31281606f5205b0191c17c3b4d2d56e1ddbb2dc6/web-fonts-with-css/css/fontawesome-all.css#L10-L15
      decl.cloneBefore({
        prop: 'text-rendering',
        value: 'auto'
      });
      decl.cloneBefore({
        prop: '-webkit-font-smoothing',
        value: 'antialiased'
      });
      decl.cloneBefore({
        prop: '-moz-osx-font-smoothing',
        value: 'grayscale'
      });
    }
    // set content property
    if (decl.prop === 'font-icon' || decl.prop === 'font-icon-glyph') {
      const fontIcon = parseFontIconValue(decl.value);
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
      const iconCharCodeHex = iconCharCode.toString(16);
      decl.value = '\'\\e' + '0'.repeat(Math.max(0, 3 - iconCharCodeHex.length)) + iconCharCodeHex + '\'';
      // Turn `font-icon:` into `content:`
      decl.prop = 'content';
    }
  });
}

/**
 * @param fontName {string} The name of the font (font-family)
 * @param postCssRoot {any} The postCss root object
 * @param enforcedSvgHeight {number} the enforced height of the svg font
 * @param svgPaths {SvgPaths} The svg path information
 */
function addFontDeclaration (fontName, postCssRoot, enforcedSvgHeight, svgPaths) {
  // The options are passed as a query string so we use the relative svg paths to reduce the path length per file
  const options = { svgs: svgPaths.relative, name: fontName, enforcedSvgHeight: enforcedSvgHeight };
  // Resolve the icon font plugin directoy in case the iconfont-webpack-plugin is used as a sub dependency
  const iconFontPluginDirectory = path.dirname(require.resolve('../'));
  // Use paths always with slash also for win32 to prevent an issues with resolving the placeholder on windows
  const iconFontLoaderPath = path.join(iconFontPluginDirectory, 'lib/loader.js').replace(/\\/g, '/');
  const iconFontPlaceholderPath = path.join(iconFontPluginDirectory, 'placeholder.svg').replace(/\\/g, '/');
  // Use !! to tell webpack that we don't want any other loader to kick in
  const url = '~!!' + iconFontLoaderPath + '?' + JSON.stringify(options) + '!' + iconFontPlaceholderPath;
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
  /* istanbul ignore if: Skip processing empty results */
  if (!result || !result.opts || !result.opts.from) {
    return;
  }
  const cssFilename = result.opts.from;
  const context = path.dirname(cssFilename);
  return getSvgPaths(root, config.resolve, context)
    .then(/** @returns {any} */function (svgPaths) {
      // Stop if the css file contains no `font-icon:url('..');` declarations
      if (svgPaths.resolved.length === 0) {
        return;
      }
      // Generate a font icon name
      const md5sum = crypto.createHash('md5');
      md5sum.update(JSON.stringify(svgPaths.relative));
      let fontName = md5sum.digest('hex').substr(0, 6);
      // Prefix the fontname with a letter as fonts with a leading number are not allowed
      fontName = config.fontNamePrefix + String.fromCharCode(fontName.charCodeAt(0) + 20) + fontName.substr(1);
      // Update the css
      const processCssPromise = Promise.all([
        // add the font faces
        addFontDeclaration(fontName, root, config.enforcedSvgHeight, svgPaths),
        // replace the `font-icon` occurences
        replaceIconFontDeclarations(fontName, root, svgPaths)
      ]);
      // Return an empty promise
      return processCssPromise.then(function () { });
    });
});
