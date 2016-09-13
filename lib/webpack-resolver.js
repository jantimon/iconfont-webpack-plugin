/**
 * Returns the resolved file request for the given compiler instance
 *
 * E.g.:
 * var absolutePath = getResolvedFilename('css!./demo.css', compiler, context);
 *
 */
var path = require('path');
module.exports = function getResolvedFilename (request, compiler, context) {
  var requestWithoutLoaders = request.replace(/^.+!/, '').replace(/\?.+$/, '');
  return new Promise((resolve, reject) => {
    function callback (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(path.resolve(compiler.context, result));
      }
    }
    if (compiler.resolvers.normal.resolve.length === 4) {
      // Resolve using Webpack 2
      compiler.resolvers.normal.resolve({}, context, requestWithoutLoaders, callback);
    } else {
      // Resolve using Webpack 1
      compiler.resolvers.normal.resolve(context, requestWithoutLoaders, callback);
    }
  });
};
