'use strict';
/**
 * Mock of a webpack compiler instance
 */
const path = require('path');
const root = path.resolve(__dirname, '../../');

const loader = {
  resolve: function (context, requestWithoutLoaders, callback) {
    if (requestWithoutLoaders === '....') {
      return callback(new Error('Mock Error'));
    }
    callback(null, path.resolve(root, context, requestWithoutLoaders));
  }
};

module.exports = {
  loader
};
