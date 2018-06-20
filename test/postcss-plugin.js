'use strict';
/* eslint max-len: off, quotes:off, arrow-parens:off */
import test from 'ava';
import path from 'path';
import postcss from 'postcss';
import postcssPlugin from '../lib/postcss-plugin.js';
import { loader } from './helpers/loader-mock.js';

const iconFontPath = path.dirname(__dirname).replace(/\\/g, '/');

async function processCss (css, options = {}) {
  const postCssPluginOptions = {
    resolve: loader.resolve,
    fontNamePrefix: options.fontNamePrefix || '',
    modules: options.modules
  };
  const trimmedCss = css.replace(/\s*\n\s*/g, '\n');
  return postcss([ postcssPlugin(postCssPluginOptions) ])
    .process(trimmedCss, { from: path.join(__dirname, 'src/app.css'), to: 'app.css' });
}

function getDeclarations (cssNode, propertyName) {
  const declarations = [];
  cssNode.walkDecls((declaration) => {
    if (declaration.prop === propertyName) {
      declarations.push(declaration);
    }
  });
  return declarations;
}

/**
 * Small helper to get information from postcss nodes
 * e.g. getDeclaration(cssRoot, 'font-family').value -> 'Arial'
 */
function getDeclaration (cssNode, propertyName) {
  const declarations = getDeclarations(cssNode, propertyName);
  if (declarations.length === 0) {
    throw new Error(`No declaration named "${propertyName}" found.`);
  }
  if (declarations.length > 1) {
    throw new Error(`Multiple declaration named "${propertyName}" found.`);
  }
  return declarations[0];
}

test('should add content with the font glyph', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
  `);
  t.is(getDeclaration(postcssResult.root, 'content').value, `'\\e000'`);
  t.pass();
});

test('should reuse the same glyph for the same svg', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
    i {
      font-icon: url(./fixtures/account-494x512.svg)
    }
    p {
      font-icon: url("./fixtures/account-494x512.svg")
    }
  `);
  t.is(getDeclarations(postcssResult.root, 'content')[0].value, `'\\e000'`);
  t.is(getDeclarations(postcssResult.root, 'content')[1].value, `'\\e000'`);
  t.is(getDeclarations(postcssResult.root, 'content')[2].value, `'\\e000'`);
  t.pass();
});

test('should create a new glyph for a different svg', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
    p {
      font-icon: url('./fixtures/account-986x1024.svg')
    }
  `);
  t.is(getDeclarations(postcssResult.root, 'content')[0].value, `'\\e000'`);
  t.is(getDeclarations(postcssResult.root, 'content')[1].value, `'\\e001'`);
  t.pass();
});

test('should remove the font-icon declaration', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
  `);
  t.is(getDeclarations(postcssResult.root, 'font-icon').length, 0);
  t.pass();
});

test('should add font-face', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
  `);
  const fontDefinition = postcssResult.root.nodes[0];
  t.is(fontDefinition.type, 'atrule');
  t.is(fontDefinition.name, 'font-face');
  t.is(getDeclaration(fontDefinition, 'font-family').value, 'wc69f6');
  t.pass();
});

test('should add font-face with fontNamePrefix', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
  `, { fontNamePrefix: 'prefix-' });
  const fontDefinition = postcssResult.root.nodes[0];
  t.is(fontDefinition.type, 'atrule');
  t.is(fontDefinition.name, 'font-face');
  t.is(getDeclaration(fontDefinition, 'font-family').value, 'prefix-wc69f6');
  t.pass();
});

test('should use the same font-family for all font-icons', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
    p {
      font-icon: url('./fixtures/account-986x1024.svg')
    }
  `);
  const fontDefinition = postcssResult.root.nodes[0];
  const fontName = getDeclaration(fontDefinition, 'font-family').value;
  const linkRule = postcssResult.root.nodes[1];
  const linkFont = getDeclaration(linkRule, 'font-family').value;
  const paragraphRule = postcssResult.root.nodes[1];
  const paragraphFont = getDeclaration(paragraphRule, 'font-family').value;
  t.is(linkFont, fontName);
  t.is(paragraphFont, fontName);
  t.pass();
});

test('should allow to set the font-size', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: 50% url('./fixtures/account-494x512.svg')
    }
  `);
  const fontDefinition = postcssResult.root.nodes[0];
  const fontName = getDeclaration(fontDefinition, 'font-family').value;
  const linkRule = postcssResult.root.nodes[1];
  const linkFont = getDeclaration(linkRule, 'font').value;
  const expectedFontValue = `normal normal normal 50%/1 ${fontName}`;
  t.is(linkFont, expectedFontValue);
  t.pass();
});

test('should set the font-weight to normal', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
  `);
  const linkRule = postcssResult.root.nodes[1];
  const fontWeight = getDeclaration(linkRule, 'font-weight').value;
  t.is(fontWeight, 'normal');
  t.pass();
});

test('should not set the font-weight if shorthand is used', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: 12px url('./fixtures/account-494x512.svg')
    }
  `);
  const linkRule = postcssResult.root.nodes[1];
  t.is(getDeclarations(linkRule, 'font-weight').length, 0);
  t.pass();
});

test('should not create a font if there is no icon', async (t) => {
  const postcssResult = await processCss(`
    a {
      color: green
    }
  `);
  t.is(getDeclarations(postcssResult.root, 'font-family').length, 0);
  t.is(postcssResult.root.nodes.length, 1);
  t.pass();
});

test('should pass the svgs and font name to the iconfont-webpack-plugin loader', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
    p {
      font-icon: url('./fixtures/account-494x512.svg')
    }
  `);
  const fontDefinition = postcssResult.root.nodes[0];
  const fontName = getDeclaration(fontDefinition, 'font-family').value;
  const fontSrc = getDeclaration(fontDefinition, 'src').value;
  const loaderOptions = {
    svgs: [ 'test/src/fixtures/account-494x512.svg' ],
    name: fontName
  };
  const expectedSrc = `url('~!!${iconFontPath}/lib/loader.js?${JSON.stringify(loaderOptions)}!${iconFontPath}/placeholder.svg') format('woff')`;
  t.is(fontSrc, expectedSrc);
  t.pass();
});

test('should pass the svgs and font name to the iconfont-webpack-plugin loader if css-modules are enabled', async (t) => {
  const postcssResult = await processCss(`
    a {
      font-icon: url('./fixtures/account-494x512.svg')
    }
    p {
      font-icon: url('./fixtures/account-494x512.svg')
    }
  `, { modules: true });
  const fontDefinition = postcssResult.root.nodes[0];
  const fontName = getDeclaration(fontDefinition, 'font-family').value;
  const fontSrc = getDeclaration(fontDefinition, 'src').value;
  const loaderOptions = {
    svgs: [ 'test/src/fixtures/account-494x512.svg' ],
    name: fontName
  };
  const expectedSrc = `url('!!${iconFontPath}/lib/loader.js?${JSON.stringify(loaderOptions)}!${iconFontPath}/placeholder.svg') format('woff')`;
  t.is(fontSrc, expectedSrc);
  t.pass();
});

test('should throw an error for url syntax errors', async (t) => {
  let error;
  try {
    await processCss(`
      a {
        font-icon: url()
      }
    `);
  } catch (e) {
    error = e.message;
  }
  t.is(error, 'Could not parse url "url()".');
  t.pass();
});

test('should forward an error from the webpack resolver', async (t) => {
  let error;
  try {
    await processCss(`
      a {
        font-icon: url('....')
      }
    `);
  } catch (e) {
    error = e.message;
  }
  t.is(error, 'Mock Error');
  t.pass();
});
