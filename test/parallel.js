const assert = require('assert');
const { wait } = require('./helpers');
const test = require('..');

test('should pass last', async () => {
  await wait(100);
  assert(true);
});

test('should pass in-between', async () => {
  await wait(0);
  assert(true);
});

test('should pass first', () => {
  assert(true);
});
