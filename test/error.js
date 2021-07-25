import { strict as assert } from 'assert';
import test from '../index.js';
import { add, addAsync } from './helpers.js';

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

test('should fail', () => {
  assert.equal(add(1, 2), 4);
});

test('should fail with returned rejected promise', () => {
  return addAsync(1, 'a');
});
