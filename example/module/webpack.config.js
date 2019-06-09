var path = require('path');
var IconfontWebpackPlugin = require('../../');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                new IconfontWebpackPlugin({
                  resolve: loader.resolve
                })
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' })
  ]
};

// The following lines are only for mocking a real webpack environment
// please don't use them for your configuration
module.exports.context = __dirname;
module.exports.bail = true;
