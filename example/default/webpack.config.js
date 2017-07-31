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
    rules: [
      { test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  new IconfontWebpackPlugin(loader)
                ]
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};

// The following lines are only for mocking a real webpack environment
// please don't use them for your configuration
module.exports.context = __dirname;
module.exports.bail = true;
