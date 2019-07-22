const assert = require('assert');
const test = require('..');

const wait = ms => new Promise(r => setTimeout(r, ms));

test('should not time out', async () => {
  assert(true);
});

test('should not time out (50ms)', async () => {
  await wait(50);
  assert(true);
});

test('should time out (150ms)', async () => {
  await wait(150);
  assert(true);
});

test('should time out (150ms)', async () => {
  await wait(150);
  assert(true);
});

test('should not time out (1ms)', async () => {
  await wait(1);
  assert(true);
});
