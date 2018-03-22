'use strict';
/**
 * This loader is a helper to connect postcss-plugin.js with the icons-to-woff.js generator
 * and webpack for caching and file-watching.
 *
 * Parses the query parameters and returns a base64 font:
 * 'module.exports="data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAQwAA..";
 */
const createIconFont = require('./icons-to-woff.js');
const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function () {
  // Don't regenerate as long as the svgs don't change
  if (this.cacheable) {
    this.cacheable();
  }
  const callback = this.async();
  // The query is built in postcss-plugin.js in addFontDeclaration
  // it contains the following values:
  // { svgs: resolvedRelativeSvgs, name: fontName };
  const query = loaderUtils.parseQuery(this.query);
  // Add svgs to webpack file watching:
  query.svgs.forEach((svg) => this.addDependency(path.resolve(svg)));
  // Generate the fonts
  createIconFont(this._compiler.inputFileSystem, query.svgs, query)
    .then((result) => {
      // Return the font to webpack
      const url = '"data:application/x-font-woff;charset=utf-8;base64,' + result + '"';
      callback(null, 'module.exports=' + JSON.stringify(url) + ';');
    }, function (err) {
      // In case of an svg generation error return an invalid font and throw an error
      const url = '"data:application/x-font-woff;charset=utf-8;base64,"';
      err.message += ' - Tried to compile: ' + JSON.stringify(query.svgs, null, 2);
      callback(new Error(err), 'module.exports=' + JSON.stringify(url) + ';');
    });
};
