# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.0.0"></a>
# [2.0.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v1.2.0...v2.0.0) (2018-05-08)


### Features

* Add font-icon-glyph ([#12](https://github.com/jantimon/iconfont-webpack-plugin/issues/12)) ([754af99](https://github.com/jantimon/iconfont-webpack-plugin/commit/754af99)), closes [#8](https://github.com/jantimon/iconfont-webpack-plugin/issues/8)


### BREAKING CHANGES

* Font smoothing is changed to improve the icon quality



<a name="1.2.0"></a>
# [1.2.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v1.1.0...v1.2.0) (2018-03-23)


### Features

* Add support for Webpack 4 ([56ea1ce](https://github.com/jantimon/iconfont-webpack-plugin/commit/56ea1ce))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v1.0.0...v1.1.0) (2017-08-04)


### Features

* **loader:** Add support for css-modules ([5e1e7fa](https://github.com/jantimon/iconfont-webpack-plugin/commit/5e1e7fa))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.11...v1.0.0) (2017-07-31)

### Features

* **postcss-plugin:** Add support for postcss-loader 2.x ([#7](https://github.com/jantimon/iconfont-webpack-plugin/issues/7)) ([8ff664b](https://github.com/jantimon/iconfont-webpack-plugin/commit/8ff664b))


### Breaking Changes

* Dropped support for Node version older than 6 (because of dependencies)
* Dropped support for postcss-loader 0.x and 1.x (because of breaking changes in 2.x)


<a name="0.0.12"></a>
## [0.0.11](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.11...v0.0.12) (2017-01-03)


### Bug Fixes

* Copy placeholder svg into the node_modules folder for tests ([7abbbbd](https://github.com/jantimon/iconfont-webpack-plugin/commit/7abbbbd))



<a name="0.0.11"></a>
## [0.0.11](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.10...v0.0.11) (2017-01-03)


### Bug Fixes

* Add placeholder.svg ([eb92f6f](https://github.com/jantimon/iconfont-webpack-plugin/commit/eb92f6f))



<a name="0.0.10"></a>
## [0.0.10](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.9...v0.0.10) (2017-01-03)


### Features

* **plugin:** Use a placeholder to allow better optimizations ([da25a0d](https://github.com/jantimon/iconfont-webpack-plugin/commit/da25a0d))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.8...v0.0.9) (2016-09-30)


### Bug Fixes

* **postcss-plugin:** Fix windows path issues ([7cd100a](https://github.com/jantimon/iconfont-webpack-plugin/commit/7cd100a))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.7...v0.0.8) (2016-09-30)


### Bug Fixes

* **postcss-plugin:** Fixed resolving files for context less child compiler ([9797c0b](https://github.com/jantimon/iconfont-webpack-plugin/commit/9797c0b))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.6...v0.0.7) (2016-09-22)


### Bug Fixes

* **postcss-plugin:** Allow urls without quotes ([325a167](https://github.com/jantimon/iconfont-webpack-plugin/commit/325a167))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.5...v0.0.6) (2016-09-21)


### Features

* **postcss-plugin:** Add font-size shorthand ([ee524cc](https://github.com/jantimon/iconfont-webpack-plugin/commit/ee524cc))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.4...v0.0.5) (2016-09-21)


### Features

* **icons-to-woff:** Allow to generate variable height fonts ([141ac91](https://github.com/jantimon/iconfont-webpack-plugin/commit/141ac91))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.3...v0.0.4) (2016-09-14)


### Bug Fixes

* **icons-to-woff:** hide "font created" message ([1dbb1fd](https://github.com/jantimon/iconfont-webpack-plugin/commit/1dbb1fd))
* **icons-to-woff:** ignore `fill="none"` in svgs ([caf29be](https://github.com/jantimon/iconfont-webpack-plugin/commit/caf29be))


### Performance Improvements

* **postcss-plugin:** reduce font name length ([edd9168](https://github.com/jantimon/iconfont-webpack-plugin/commit/edd9168))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.2...v0.0.3) (2016-09-14)


### Bug Fixes

* **postcss-plugin:** Fix dependency watching ([ccbf05e](https://github.com/jantimon/iconfont-webpack-plugin/commit/ccbf05e))


<a name="0.0.2"></a>
## [0.0.2](https://github.com/jantimon/iconfont-webpack-plugin/compare/v0.0.1...v0.0.2) (2016-09-13)


### Bug Fixes

* **postcss-plugin:** Skip css files without icons ([ee24526](https://github.com/jantimon/iconfont-webpack-plugin/commit/ee24526))


<a name="0.0.1"></a>
## [0.0.1](https://github.com/jantimon/iconfont-webpack-plugin/releases/tag/v0.0.1) (2016-09-13)


* **Initial release**