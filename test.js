const assert = require('assert');
const test = require('.');

const add = (x, y) => x + y;
const addAsync = (x, y) => (x && y ? Promise.resolve(x + y) : Promise.reject('no can do'));
const wait = ms => new Promise(r => setTimeout(r, ms));

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

// test('should fail', () => {
//   assert.strictEqual(add(1, 2), 4);
// });

test('should pass with resolved promise', async () => {
  assert.strictEqual(await addAsync(1, 2), 3);
});

test('should pass with returned promise', () => {
  return addAsync(1, 2);
});

// test('should fail with returned rejected promise', () => {
//   return addAsync(1);
// });

test('should pass with rejected promise', () => {
  assert.rejects(addAsync(1), /no can do/);
});

test('should pass with resolved promise', () => {
  assert.doesNotReject(addAsync(1, 2));
});

test('should pass with rejected promise', () => {
  assert.rejects(addAsync(1), /no can do/);
});

test('should finish last in default mode, first in serial mode', async () => {
  await wait(100);
  assert(true);
});

test('should finish first in default mode, last in serial mode', async () => {
  await wait(0);
  assert(true);
});
