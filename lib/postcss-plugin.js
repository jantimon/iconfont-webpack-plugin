var postcss = require('postcss');
var assert = require('assert');
var getResolvedFilename = require('./webpack-resolver.js');
var path = require('path');
var urlRegexp = new RegExp('url\\(("([^"]+)"|\'([^\']+)\'|([^\'")]+))\\)');
var _ = require('lodash');
var crypto = require('crypto');

/**
 * Turn `url("./demo.svg")` into `demo.svg`
 */
function getRelativeIconPath (value) {
  var relativePathResult = urlRegexp.exec(value);
  if (!relativePathResult) {
    throw new Error(`Could not parse url "${value}".`);
  }
  return relativePathResult[2] || relativePathResult[3] || relativePathResult[4];
}

function parseFontIconValue (value) {
  var valueParts = value.trim().split(' ');
  var result = {};
  // Just a url
  // font-icon: url('./demo.svg');
  if (valueParts.length === 1) {
    result.url = getRelativeIconPath(valueParts[0]);
  }
  // Font size and url
  // font-icon: 20px url('./demo.svg');
  if (valueParts.length === 2) {
    result.size = valueParts[0];
    result.url = getRelativeIconPath(valueParts[1]);
  }
  return result;
}

/**
 * Returns a promise with the result of all `icon-font:url(...)` svg paths of the given file
 *
 * @param fontName {string} The name of the font (font-family)
 * @param compiler {object} The webpack compiler instance
 * @param resolvedSvgs {string} The css loader path context to resolve relative urls
 */
function getSvgPaths (postCssRoot, compiler, context) {
  // Gather all font-icon urls:
  var unresolvedPaths = [];
  postCssRoot.walkDecls((decl) => {
    if (decl.prop === 'font-icon') {
      var fontIcon = parseFontIconValue(decl.value);
      unresolvedPaths.push(fontIcon.url);
    }
  });
  // Remove duplicates
  unresolvedPaths = _.uniq(unresolvedPaths);
  // Resolve the urls to the absolute url
  return Promise.all(unresolvedPaths.map((unresolvedPath) =>
    getResolvedFilename(unresolvedPath, compiler, context))
  )
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
 * @param resolvedSvgs {string[]} An array of unresolved files
 */
function replaceIconFontDeclarations (fontName, postCssRoot, unresolvedSvgPaths) {
  postCssRoot.walkDecls((decl) => {
    if (decl.prop === 'font-icon') {
      var fontIcon = parseFontIconValue(decl.value);
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
      var iconCharCode = unresolvedSvgPaths.indexOf(getRelativeIconPath(decl.value));
      decl.value = '\'\\e' + _.padStart(iconCharCode.toString(16), 3, '0') + '\'';
      // Turn `font-icon:` into `content:`
      decl.prop = 'content';
    }
  });
}

/**
 * @param fontName {string} The name of the font (font-family)
 * @param postCssRoot {object} The postCss root object
 * @param resolvedSvgs {string[]} An array of absolute paths to svgs
 */
function addFontDeclaration (fontName, postCssRoot, resolvedRelativeSvgs) {
  // Turn paths into shorter relative paths
  var options = { svgs: resolvedRelativeSvgs, name: fontName };
  // Use ~ to tell the loader-utils of the css loader that this is a webpack path
  // Use !! to tell webpack that we don't want any other loader to kick in
  var url = '~!!iconfont-webpack-plugin/lib/loader.js?' + JSON.stringify(options) + '!iconfont-webpack-plugin/placeholder.svg';
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
module.exports = postcss.plugin('iconfont-webpack', function (config) {
  var compiler = config.compiler;
  assert(compiler, 'The iconfont-webpack plugin requires a webpack compiler instance.');
  return function (root, result) {
    var cssFilename = result.opts.to;
    var context = path.dirname(cssFilename);
    return getSvgPaths(root, config.compiler, context)
      .then(function (svgPaths) {
        // Stop if the css file contains no `font-icon:url('..');` declarations
        if (svgPaths.resolved.length === 0) {
          return;
        }
        // Generate a font icon name
        var md5sum = crypto.createHash('md5');
        md5sum.update(JSON.stringify(_.values(svgPaths.relative)));
        var fontName = md5sum.digest('hex').substr(0, 6);
        // Prefix the fontname with a letter as fonts with a leading number are not allowed
        fontName = config.pluginOptions.fontNamePrefix + String.fromCharCode(fontName.charCodeAt(0) + 20) + fontName.substr(1);

        // Update the css
        return Promise.all([
          addFontDeclaration(fontName, root, svgPaths.relative),
          replaceIconFontDeclarations(fontName, root, svgPaths.unresolved)
        ]);
      });
  };
});
