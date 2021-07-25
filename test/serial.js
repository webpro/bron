import { strict as assert } from 'assert';
import test from '../index.js';
import { add, addAsync, wait } from './helpers.js';

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

test('should fail', () => {
  assert.equal(add(1, 2), 4);
});

test('should pass with resolved promise', async () => {
  assert.equal(await addAsync(1, 2), 3);
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
