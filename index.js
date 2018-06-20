'use strict';
let _ = require('lodash');
let assert = require('assert');

module.exports = function IconfontWebpackPlugin (userOptions) {
  // Default options
  const options = _.extend({

    // allows to prefix the font name to prevent collisions
    fontNamePrefix: '',

    // the svg size requires all svgs to have the same height
    // usually scaling the icons to 1000px should be fine but if you prefer
    // another value set it here
    enforcedSvgHeight: 1000,

    // resolve function to translate webpack urls into absolute filepaths
    // e.g. url('demo.svg') -> '/Users/me/project-x/demo.svg'
    // usually you should pass on the postcss loader
    // https://webpack.js.org/api/loaders/#this-resolve
    resolve: undefined

  }, userOptions);

  // Verify resolve function
  assert(typeof options.resolve === 'function',
    'Please pass a resolve function to the IconFontWebpackPlugin.\n' +
    'For example: \n' +
    '{\n' +
    '  loader: \'postcss-loader\',\n' +
    '  options: {\n' +
    '    plugins: (loader) => [\n' +
    '      require(\'iconfont-webpack-plugin\')({ resolve: loader.resolve }), \n\n'
  );

  // Call postcss plugin
  return require('./lib/postcss-plugin')(options);
};
