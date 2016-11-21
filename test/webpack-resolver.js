 /* eslint max-len: off, quotes:off, arrow-parens:off */
import test from 'ava';
import path from 'path';
import webpackResolverHelper from '../lib/webpack-resolver.js';
import compilerMocks from './helpers/compiler-mock.js';

const webpack1Compiler = compilerMocks.webpack1;
const webpack2Compiler = compilerMocks.webpack2;

test('should resolve a webpack path with webpack 1', async (t) => {
  const resolvedPath = await webpackResolverHelper('./test.js', webpack1Compiler, '.');
  const expectedPath = path.resolve(__dirname, '../test.js');
  t.is(resolvedPath, expectedPath);
  t.pass();
});

test('should resolve a webpack path with webpack 2', async (t) => {
  const resolvedPath = await webpackResolverHelper('./test.js', webpack2Compiler, '.');
  const expectedPath = path.resolve(__dirname, '../test.js');
  t.is(resolvedPath, expectedPath);
  t.pass();
});

test('should pass errors', async (t) => {
  let errorMessage;
  try {
    await webpackResolverHelper('', webpack1Compiler, '');
  } catch (e) {
    errorMessage = e;
  }
  t.is(errorMessage, 'Mock Error');
  t.pass();
});
