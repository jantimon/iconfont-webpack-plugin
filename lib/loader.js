// 'data:application/x-font-woff;charset=utf-8;base64,' + fontResult;
var createIconFont = require('./icons-to-woff.js');
var loaderUtils = require('loader-utils');
var path = require('path');

module.exports = function () {
  if (this.cacheable) {
    this.cacheable();
  }
  var callback = this.async();
  var query = loaderUtils.parseQuery(this.query);
  query.svgs.forEach((svg) => this.addDependency(path.resolve(svg)));
  createIconFont(query.svgs, query)
    .then((result) => {
      var url = '"data:application/x-font-woff;charset=utf-8;base64,' + result + '"';
      callback(null, 'module.exports=' + JSON.stringify(url) + ';');
    }, callback);
};
