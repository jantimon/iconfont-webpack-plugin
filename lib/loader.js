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
  createIconFont(this._compiler.inputFileSystem, query.svgs, query)
    .then((result) => {
      var url = '"data:application/x-font-woff;charset=utf-8;base64,' + result + '"';
      callback(null, 'module.exports=' + JSON.stringify(url) + ';');
    }, function (err) {
      var url = '"data:application/x-font-woff;charset=utf-8;base64,"';
      if (typeof err === 'string') {
        err = new Error(err);
      }
      err.message += ' - Tried to compile: ' + JSON.stringify(query.svgs, null, 2);
      callback(new Error(err), 'module.exports=' + JSON.stringify(url) + ';');
    });
};
