const path = require('path');
const IconfontWebpackPlugin = require('../../');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './example.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
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
              postcssOptions: (loader) => {
                return {
                  plugins: [
                    IconfontWebpackPlugin({
                      resolve: loader.resolve
                    })
                  ]
                };
              }
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
