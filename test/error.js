const assert = require('assert');
const test = require('..');

const add = (x, y) => x + y;
const addAsync = (x, y) => (x && y ? Promise.resolve(x + y) : Promise.reject(new Error('no can do')));

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

test('should fail', () => {
  assert.strictEqual(add(1, 2), 4);
});

test('should fail with returned rejected promise', () => {
  return addAsync(1);
});
