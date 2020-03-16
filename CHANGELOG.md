# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.2.2](https://github.com/jantimon/iconfont-webpack-plugin/compare/v4.2.1...v4.2.2) (2020-03-16)


### Bug Fixes

* Adjust types to align with latest typescript spec ([5b360fa](https://github.com/jantimon/iconfont-webpack-plugin/commit/5b360fa2c898f4c324dfad90e75fc97949141db8))

### [4.2.1](https://github.com/jantimon/iconfont-webpack-plugin/compare/v4.2.0...v4.2.1) (2019-07-08)


### Bug Fixes

* postcss-plugin returns now a consistent void return value ([403156a](https://github.com/jantimon/iconfont-webpack-plugin/commit/403156a))



## [4.2.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v4.1.0...v4.2.0) (2019-07-08)


### Features

* Add typechecks ([d79dee1](https://github.com/jantimon/iconfont-webpack-plugin/commit/d79dee1))



## [4.1.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v4.0.0...v4.1.0) (2019-06-10)


### Features

* drop same height requirement ([8f59298](https://github.com/jantimon/iconfont-webpack-plugin/commit/8f59298))



## [4.0.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v3.2.0...v4.0.0) (2019-06-09)


### Features

* Add support for css-loader 2 ([2956b94](https://github.com/jantimon/iconfont-webpack-plugin/commit/2956b94))


### BREAKING CHANGES

* CSS modules are only supported with css-loader >= 2.x



<a name="3.2.0"></a>
# [3.2.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v3.1.0...v3.2.0) (2019-06-09)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([59d1b5b](https://github.com/jantimon/iconfont-webpack-plugin/commit/59d1b5b))
* Remove lodash dependency ([ae9a50b](https://github.com/jantimon/iconfont-webpack-plugin/commit/ae9a50b))
* upgrade nyc package because of "Prototype Pollution" in peer-dependency ([d186cc1](https://github.com/jantimon/iconfont-webpack-plugin/commit/d186cc1))
* Use buffer for memory-fs readFile signature ([b0fc34e](https://github.com/jantimon/iconfont-webpack-plugin/commit/b0fc34e))


### Features

* **icon-generation:** Add npm configuration for saving exact versions ([22865c6](https://github.com/jantimon/iconfont-webpack-plugin/commit/22865c6))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/jantimon/iconfont-webpack-plugin/compare/v3.1.0...v3.1.1) (2019-02-26)


### Bug Fixes

* upgrade nyc package because of "Prototype Pollution" in peer-dependency ([e6fc046](https://github.com/jantimon/iconfont-webpack-plugin/commit/e6fc046))


### Features

* **icon-generation:** Add npm configuration for saving exact versions ([ff408ce](https://github.com/jantimon/iconfont-webpack-plugin/commit/ff408ce))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v3.0.1...v3.1.0) (2019-01-03)


### Features

* Add postcss-loader 3 support to peer dependency ([#31](https://github.com/jantimon/iconfont-webpack-plugin/issues/31)) ([9b02c88](https://github.com/jantimon/iconfont-webpack-plugin/commit/9b02c88))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/jantimon/iconfont-webpack-plugin/compare/v3.0.0...v3.0.1) (2018-08-10)


### Bug Fixes

* Compile error in svgicons2svgfont ([cdb6e0f](https://github.com/jantimon/iconfont-webpack-plugin/commit/cdb6e0f))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/jantimon/iconfont-webpack-plugin/compare/v2.0.0...v3.0.0) (2018-06-20)


### Features

* **icon-generation:** Add new option enforcedSvgHeight to improve the icon quality ([efed575](https://github.com/jantimon/iconfont-webpack-plugin/commit/efed575)), closes [#21](https://github.com/jantimon/iconfont-webpack-plugin/issues/21)


### BREAKING CHANGES

* **icon-generation:** SVGs are now scaled by default



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