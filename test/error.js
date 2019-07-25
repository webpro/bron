const assert = require('assert');
const { add, addAsync } = require('./helpers');
const test = require('..');

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

test('should fail', () => {
  assert.strictEqual(add(1, 2), 4);
});

test('should fail with returned rejected promise', () => {
  return addAsync(1, 'a');
});
