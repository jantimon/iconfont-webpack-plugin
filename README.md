# Icon Font Webpack Plugin
[![npm version](https://badge.fury.io/js/iconfont-webpack-plugin.svg)](http://badge.fury.io/js/iconfont-webpack-plugin) [![Dependency Status](https://david-dm.org/jantimon/iconfont-webpack-plugin.svg)](https://david-dm.org/jantimon/iconfont-webpack-plugin) [![Build status](https://travis-ci.org/jantimon/iconfont-webpack-plugin.svg)](https://travis-ci.org/jantimon/iconfont-webpack-plugin) [![Build status](https://ci.appveyor.com/api/projects/status/kp2kk6s7vsf8moea/branch/master?svg=true)](https://ci.appveyor.com/project/jantimon/iconfont-webpack-plugin/branch/master)

[![icon font webpack plugin demo](https://raw.githubusercontent.com/jantimon/iconfont-webpack-plugin/master/iconfont.gif)](https://codepen.io/jantimon/pen/YoKewb)  
This plugin tries to keep the usage and maintenance of icon fonts as simple as possible.

```css
a:before {
  font-icon: url('./account.svg');
}
```

Browser Support: IE9+  
Preprocessor Support: All - works with sass, less, stylus, postcss, vanilla css, ...

# Requirements

This plugin requires:
 + webpack 3.x or higher 
 + postcss-loader 2.x or higher
 + node 6 or higher
 + css-loader 2.x or higher

## Installation

```
npm i --save-dev postcss-loader
npm i --save-dev iconfont-webpack-plugin
```

## Configuration

All you have to do is to add the plugin to your postcss loader plugins inside your `webpack.config.js`:

```js
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                // Add the plugin
                new IconfontWebpackPlugin(loader)
              ]
            }
          }
        ]
      }
    ]
  },
```

## Advanced Configuration

Probably you won't need this but you can also pass some additional options.

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`resolve`**|`{Function}`||Required - A function which resolves the svg paths. See [resolve](https://webpack.js.org/api/loaders/#this-resolve)|
|**`fontNamePrefix`**|`{String}`|`''`| Allows to prefix the generated font name |
|**`enforcedSvgHeight`**|`{number}`|`1000`| Scales all svg to the given height |

```js
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                // Add the plugin
                new IconfontWebpackPlugin({
                  resolve: loader.resolve,
                  fontNamePrefix: 'custom-',
                  enforcedSvgHeight: 3000,
                  modules: false,
                })
              ]
            }
          }
        ]
      }
    ]
  },
```

## Usage

After setting up the plugin your css has now a new feature:  
`font-icon` declarations

```css
a:before {
  font-icon: url('./account.svg');
  transition: 0.5s color;
}

a:hover:before {
  color: red;
}
```

and it will be compiled into:

```css
@font-face {
  font-family: i96002e;
  src: url("data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAA.....IdAA==") format('woff');
}

a:before {
  font-family: i96002e;
  content: '\E000';
  transition: 0.5s color;
}

a:hover:before {
  color: red;
}
```

## Icon sizes

Shorthand for setting the icon size and the icon:

```css
a:before {
  font-icon: 80% url('./account.svg');
}
```

## SVG Requirements

The main work of the iconfont-webpack-plugin is done by [svg2ttf](https://github.com/fontello/svg2ttf) which converts svgs into fonts.  
Therefore it inherits all its [limitations](https://github.com/fontello/fontello/wiki/How-to-use-custom-images#importing-svg-images).

1. Remove all fills and colors. You can probably leave black fills. In fonts, fill is defined by contour direction. Make sure that you don't have any complex rules like evenodd fills.
2. Remove all FAT line attributes. This is not supported by Fontello. In fonts, fat lines are drown by 2 nested contours.
3. Join all contours to a single outline. This is the last and the most important step. Usually editors automatically set the correct contour direction depending on nesting and black fills.

## Should you use icon fonts for everything?

No.

Icon fonts are really good for decorative icons (where the icon is purely ornamental and doesn’t incorporate core meaning or functionality).

For critical icons without fallbacks (like a hamburger menu icon) you should rather use SVGs.
But also JPEGs, PNGs and even GIFs have their use cases.

Pick the best solution for your problem - there is no silver bullet.
With this plugin it is pretty easy to use pixel images, svgs and font-icons side by side.

## When should you use icon fonts over pure SVGs?

SVGs have some disadvantages and lack certain features especially when used inside pseudo elements:

* [CSS-Transform issues in older Internet Explorer versions](http://stackoverflow.com/questions/21298338/css-transform-on-svg-elements-ie9)
* [IE9 - IE 11 scaling issues](https://gist.github.com/larrybotha/7881691)
* Fill color doesn't work for background SVG images
* Inline SVGs are resolved relative to the page not to the css
* You want to use background-clip:text

## What about all the rant on icon fonts?

Like all technologies there are disadvantages when using icon fonts.  
We tried to apply best practices to solve the main issues for you.

* Screen Reader friendly: All generated icons use the [Unicode Private Use Areas](https://en.wikipedia.org/wiki/Private_Use_Areas)
* Prevents [FOUT](http://www.paulirish.com/2009/fighting-the-font-face-fout/)

# License

This project is licensed under [MIT](https://github.com/jantimon/iconfont-webpack-plugin/blob/master/LICENSE).

