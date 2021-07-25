import { strict as assert } from 'assert';
import test from '../index.js';
import { wait } from './helpers.js';

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
