const assert = require('assert');
const { add, addAsync, wait } = require('./helpers');
const test = require('..');

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

test('should fail', () => {
  assert.strictEqual(add(1, 2), 4);
});

test('should pass with resolved promise', async () => {
  assert.strictEqual(await addAsync(1, 2), 3);
});

test('should pass with returned promise', () => {
  return addAsync(1, 2);
});

test('should pass with rejected promise', () => {
  assert.rejects(() => addAsync(1, 'a'), /No can do/);
});

test('should pass with resolved promise', () => {
  assert.doesNotReject(() => addAsync(1, 2));
});

test('should pass with rejected promise', () => {
  assert.rejects(() => addAsync(1, 'a'), /No can do/);
});

test('should pass first in serial mode', async () => {
  await wait(100);
  assert(true);
});

test('should pass last in serial mode', async () => {
  await wait(0);
  assert(true);
});
