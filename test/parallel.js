const assert = require('assert');
const test = require('..');

const wait = ms => new Promise(r => setTimeout(r, ms));

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
