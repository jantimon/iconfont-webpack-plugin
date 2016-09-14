var assert = require('assert');
var svgicons2svgfont = require('svgicons2svgfont');
var svg2ttf = require('svg2ttf');
var ttf2woff = require('ttf2woff');
var Readable = require('stream').Readable;
var fs = require('fs');

module.exports = function createIconFont (icons, options) {
  assert(typeof options === 'object', 'Options are mandatory.');
  return new Promise((resolve, reject) => {
    var fontStream = svgicons2svgfont({
      name: options.name,
      normalize: true,
      fontHeight: 512,
      log: function () {},
      error: function (err) {
        reject(err);
      }
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
      var glyph = new Readable();
      glyph._read = function noop () {};
      glyph.metadata = {
        unicode: [String.fromCodePoint('\ue000'.charCodeAt(0) + i)],
        name: 'i' + i
      };
      fontStream.write(glyph);
      fs.readFile(filename, 'utf8', function (err, result) {
        if (err) {
          return reject(err);
        }
        // prevent svgs with fill="none" from beeing translated into an empty symbol
        result = result.replace(/\sfill\s*=\s*["']?none['"]?/ig, '');
        glyph.push(result);
        glyph.push(null);
      });
    });
    fontStream.end();
  })
  .then((svgFont) => svg2ttf(svgFont, {}).buffer)
  .then((ttfFont) => ttf2woff(ttfFont).buffer)
  .then((woffFont) => new Buffer(woffFont).toString('base64'));
};
