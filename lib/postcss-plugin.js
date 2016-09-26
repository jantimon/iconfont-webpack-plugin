var postcss = require('postcss');
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
 * Returns a promise with the result of all resolved svg paths of the given file
 *
 * @param fontName {string} The name of the font (font-family)
 * @param compiler {object} The webpack compiler instance
 * @param resolvedSvgs {string} The css loader path context to resolve relative urls
 */
function getSvgPaths (postCssRoot, compiler, context) {
  var relativePaths = [];
  postCssRoot.walkDecls((decl) => {
    if (decl.prop === 'font-icon') {
      var fontIcon = parseFontIconValue(decl.value);
      relativePaths.push(fontIcon.url);
    }
  });
  relativePaths = _.uniq(relativePaths);
  return Promise.all(relativePaths.map((relativePath) =>
    getResolvedFilename(relativePath, compiler, context))
  ).then((resolvedFilenames) => ({unresolved: relativePaths, resolved: resolvedFilenames}));
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
function addFontDeclaration (fontName, postCssRoot, resolvedSvgs) {
  // Turn paths into shorter relative paths
  var relativeResolved = resolvedSvgs.map((absolute) => path.relative('.', absolute));
  var options = { svgs: relativeResolved, name: fontName };
  // Use ~ to tell the loader-utils of the css loader that this is a webpack path
  // Use !! to tell webpack that we don't want any other loader to kick in
  var url = '~!!' + require.resolve('./loader.js') + '?' + JSON.stringify(options) + '!' + require.resolve('../');
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
  return function (root, result) {
    var cssFilename = result.opts.to;
    var context = path.dirname(cssFilename);
    return getSvgPaths(root, config.compilation.compiler, context)
      .then(function (svgPaths) {
        // Stop if the css file contains no `font-icon:url('..');` declarations
        if (svgPaths.resolved.length === 0) {
          return;
        }
        // Generate a font icon name
        var md5sum = crypto.createHash('md5');
        var cwd = config.compilation.compiler.context;
        md5sum.update(JSON.stringify(_.values(svgPaths.resolved).map((svgPath) => path.relative(cwd, svgPath))));
        var fontName = md5sum.digest('hex').substr(0, 6);
        // Prefix the fontname with a letter as fonts with a leading number are not allowed
        fontName = String.fromCharCode(fontName.charCodeAt(0) + 20) + fontName.substr(1);

        // Update the css
        return Promise.all([
          addFontDeclaration(fontName, root, svgPaths.resolved),
          replaceIconFontDeclarations(fontName, root, svgPaths.unresolved)
        ]);
      });
  };
});
