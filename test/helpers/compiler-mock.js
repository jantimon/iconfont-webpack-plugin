/**
 * Mock of a webpack compiler instance
 */
const path = require('path');
const root = path.resolve(__dirname, '../../');

const compilerWebpack1 = {
  context: root,
  resolvers: {
    normal: {
      resolve: function (context, requestWithoutLoaders, callback) {
        if (requestWithoutLoaders === '') {
          return callback('Mock Error');
        }
        callback(null, path.resolve(root, context, requestWithoutLoaders));
      }
    }
  }
};

const compilerWebpack2 = {
  context: root,
  resolvers: {
    normal: {
      resolve: function (context, basePath, requestWithoutLoaders, callback) {
        callback(null, path.resolve(root, basePath, requestWithoutLoaders));
      }
    }
  }
};

module.exports = {
  webpack1: compilerWebpack1,
  webpack2: compilerWebpack2
};
