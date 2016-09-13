# ALPHA

This release is rather for feedback purpose than for production usage.

# Icon Font Webpack Plugin

This plugin tries to keep the usage and maintainance of icon fonts as simple as possible.

## Installation

```
npm i --save-dev iconfont-webpack-plugin
```

## Configuration

```js
var path = require('path');

var IconfontWebpackPlugin = require('iconfont-webpack-plugin');

  // make sure you use the postcss loader:
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'css-loader!postcss-loader'
      }
    ]
  },
  // add the plugin
  plugins: [
    new IconfontWebpackPlugin()
  ]

```

## Usage

If you set this plugin up properly you can finely use a `font-icon` declarations
in your `css/scss/sass/less/...`:

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

## Why shouldn't I just use SVGs?

SVGs have some disadvantages and lack certain features especially when using inside pseudo elements.

* [CSS-Transform issues in older Internet Explorer versions](http://stackoverflow.com/questions/21298338/css-transform-on-svg-elements-ie9)
* [IE9 - IE 10 scaling issues](https://gist.github.com/larrybotha/7881691)
* Fill color doesn't work on background SVG images
* Inline SVGs are resolved relative to the page not to the css

## Should I use icon fonts for everything?

No. Icon fonts have use cases but the same is true for SVGs, JPEGs, PNGs or even GIFs.  
Pick the best solution for your problem - there is no silver bullet.


# License

This project is licensed under [MIT](https://github.com/jantimon/iconfont-webpack-plugin/blob/master/LICENSE).

