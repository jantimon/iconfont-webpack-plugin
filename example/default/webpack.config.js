var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var IconfontWebpackPlugin = require('../../');
module.exports = {
  context: __dirname,
  entry: './example.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      }
    ]
  },
  plugins: [
    new IconfontWebpackPlugin(),
    new ExtractTextPlugin('styles.css')
  ]
};
