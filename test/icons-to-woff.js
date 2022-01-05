'use strict';
/* eslint max-len: off, quotes:off, arrow-parens:off */
import createIconFont from '../lib/icons-to-woff.js';
import fs from 'fs';
import test from 'ava';

test('should throw an error when an svg cannot be found', async (t) => {
  let error;
  try {
    await createIconFont(fs, [
      './test/fixtures/does-not-exist.svg'
    ], {
      name: 'test'
    });
  } catch (e) {
    error = e.message;
  }

  t.is(error.substring(0, 33), 'ENOENT: no such file or directory');
  t.pass();
});

test('should throw an error when a malformed svg is provided', async (t) => {
  let error;
  try {
    await createIconFont(fs, [
      './test/fixtures/malformed.svg'
    ], {
      name: 'test'
    });
  } catch (e) {
    error = e.message;
  }

  t.is(error.substring(0, 32), 'Non-whitespace before first tag.');
  t.pass();
});

test('should produce the same output when receiving the same input and configuration', async (t) => {
  const svgs = [
    './test/fixtures/account-494x512.svg',
    './test/fixtures/account-986x1024.svg'
  ];

  const test1 = await createIconFont(fs, svgs, {
    name: 'test'
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const test2 = await createIconFont(fs, svgs, {
    name: 'test'
  });

  t.is(test1, test2);
  t.pass();
});

test('should produce different output when receiving the same input but different fontHeight', async (t) => {
  const svgs = [
    './test/fixtures/account-494x512.svg',
    './test/fixtures/account-986x1024.svg'
  ];

  const test1 = await createIconFont(fs, svgs, {
    enforcedSvgHeight: 32
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const test2 = await createIconFont(fs, svgs, {
    enforcedSvgHeight: 16
  });

  t.not(test1, test2);
  t.pass();
});
