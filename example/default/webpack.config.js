var path = require('path');
var IconfontWebpackPlugin = require('../../');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './example.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader?importLoaders=1'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [];
            }
          }
        }]
      })
    }]
  },
  plugins: [
    new IconfontWebpackPlugin(),
    new ExtractTextPlugin('styles.css')
  ]
};

// The following lines are only for mocking a real webpack environment
// please don't use them for your configuration
module.exports.context = __dirname;
module.exports.bail = true;
