Icon Font Webpack Plugin
===================

This aims try to make using icon fonts as convenient as possible.


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


Now you can use `font-icon` in your css like here:

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