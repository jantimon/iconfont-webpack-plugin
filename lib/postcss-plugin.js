var postcss = require('postcss');
var getResolvedFilename = require('./webpack-resolver.js');
var path = require('path');
var urlRegexp = new RegExp('url\\(("([^"]+)"|\'([^\']+)\'|([^\\)+]))\\)');
var _ = require('lodash');
var crypto = require('crypto');

function getRelativeIconPath (value) {
  var relativePathResult = urlRegexp.exec(value);
  return relativePathResult ? (relativePathResult[2] || relativePathResult[3] || relativePathResult[4]) : undefined;
}

/**
 * Returns a promise with the result of all resolved svg paths of the given file
 */
function getSvgPaths (root, compiler, context) {
  var relativePaths = [];
  root.walkDecls((decl) => {
    if (decl.prop === 'font-icon') {
      var relativePath = getRelativeIconPath(decl.value);
      if (relativePath) {
        relativePaths.push(relativePath);
      }
    }
  });
  relativePaths = _.uniq(relativePaths);
  return Promise.all(relativePaths.map((relativePath) =>
    getResolvedFilename(relativePath, compiler, context))
  ).then((resolvedFilenames) => ({unresolved: relativePaths, resolved: resolvedFilenames}));
}

function replaceIconFontDeclarations (fontName, root, unresolvedSvgPaths) {
  root.walkDecls((decl) => {
    if (decl.prop === 'font-icon') {
      var iconCharCode = unresolvedSvgPaths.indexOf(getRelativeIconPath(decl.value));
      decl.cloneBefore({
        prop: 'font-family',
        value: fontName
      });
      decl.prop = 'content';
      decl.value = '\'\\e' + _.padStart(iconCharCode.toString(16), 3, '0') + '\'';
    }
  });
}

function addFontDeclaration (fontName, root, resolvedSvgs) {
  var relativeResolved = resolvedSvgs.map((absolute) => path.relative('.', absolute));
  var options = { svgs: relativeResolved, name: fontName };
  var url = '~!!' + require.resolve('./loader.js') + '?' + JSON.stringify(options) + '!' + require.resolve('../');
  root.prepend(postcss.parse('@font-face { font-family: ' + fontName + '; src:url(\'' + url + '\') format(\'woff\') }'));
}

module.exports = postcss.plugin('iconfont-webpack', function (opts) {
  return function (root, result) {
    var cssFilename = result.opts.to;
    var context = path.dirname(cssFilename);
    return getSvgPaths(root, opts.compilation.compiler, context)
      // Replace 'font-icon: url("./demo.svg")' with the correct css
      .then(function (svgPaths) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(JSON.stringify(_.values(svgPaths.resolved)));
        var fontName = 'i' + md5sum.digest('hex').substr(0, 6);
        return Promise.all([
          addFontDeclaration(fontName, root, svgPaths.resolved),
          replaceIconFontDeclarations(fontName, root, svgPaths.unresolved)
        ]);
      });
  };
});
