import { strict as assert } from 'assert';
import test from '../index.js';
import { wait } from './helpers.js';

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
