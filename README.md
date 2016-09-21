# ALPHA

This release is rather for feedback purpose than for production usage.

# Icon Font Webpack Plugin

This plugin tries to keep the usage and maintenance of icon fonts as simple as possible.  

## Installation

```
npm i --save-dev iconfont-webpack-plugin
```

## Configuration

```js
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

## What about all the rant on icon fonts?

Like all technologies there are disadvantages when using icon fonts.  
We tried to apply best practices to solve the main issues for you.

* Screen Reader friendly: All generated icons use the [Unicode Private Use Areas](https://en.wikipedia.org/wiki/Private_Use_Areas)
* Prevents [FOUT](http://www.paulirish.com/2009/fighting-the-font-face-fout/)

# License

This project is licensed under [MIT](https://github.com/jantimon/iconfont-webpack-plugin/blob/master/LICENSE).

