'use strict';
var _ = require('lodash');

function IconfontWebpackPlugin (options) {
  // Default options
  this.options = _.extend({

  }, options);
}

IconfontWebpackPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation) =>
    compilation.plugin('postcss-loader-before-processing',
      (plugins) => (plugins || []).concat(
        require('./lib/postcss-plugin')({
          compilation: compilation,
          pluginOptions: this.options
        })
      )
    )
  );
};

module.exports = IconfontWebpackPlugin;
