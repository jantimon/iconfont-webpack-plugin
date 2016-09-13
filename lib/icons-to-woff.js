var assert = require('assert');
var svgicons2svgfont = require('svgicons2svgfont');
var svg2ttf = require('svg2ttf');
var ttf2woff = require('ttf2woff');
var fs = require('fs');

module.exports = function createIconFont (icons, options) {
  assert(typeof options === 'object', 'Options are mandatory.');
  return new Promise((resolve, reject) => {
    var fontStream = svgicons2svgfont({
      name: options.name,
      normalize: true,
      fontHeight: 512
    });
    var svgFont = '';
    fontStream
      .on('finish', function () {
        resolve(svgFont);
      })
      .on('data', function (part) {
        svgFont += part;
      })
      .on('error', function (err) {
        reject(err);
      });
    icons.forEach((filename, i) => {
      var glyph = fs.createReadStream(filename);
      glyph.metadata = {
        unicode: [String.fromCodePoint('\ue000'.charCodeAt(0) + i)],
        name: 'icon-' + i
      };
      fontStream.write(glyph);
    });
    fontStream.end();
  })
  .then((svgFont) => svg2ttf(svgFont, {}).buffer)
  .then((ttfFont) => ttf2woff(ttfFont).buffer)
  .then((wofffont) => new Buffer(wofffont).toString('base64'));
};
