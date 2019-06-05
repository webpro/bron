# bron

Tiny test runner

- A single `test` function, no helpers
- No magic, no separate processes, no dependencies
- Use Node.js [built-in assert](https://nodejs.org/api/assert.html) module, or bring your own
- Run tests in parallel (default), or serial
- Requires Node.js v10+

## Usage

```
bron <file> [--serial]
```

### sync

```js
const test = require('bron');
const assert = require('assert').strict;

const add = (x, y) => x + y;

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

test('should fail', () => {
  assert.equal(add(1, 2), 4);
});
```

```
$ bron
✔ should pass
✖ should fail
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

3 !== 4

    at /Users/lars/Projects/bron/sync.js:11:10
    ...

✖ 1 test(s) failed
✔ 1 test(s) passed
```

### async

No magic, but know that the tests run in parallel.

```js
const addAsync = (x, y) => (x && y ? Promise.resolve(x + y) : Promise.reject('no can do'));

test('should pass with resolved promise', () => {
  assert.doesNotReject(addAsync(1, 2));
});

test('should pass with rejected promise', () => {
  assert.rejects(addAsync(1), /no can do/);
});
```

### serial

Add `--serial`:

```js
const wait = ms => new Promise(r => setTimeout(r, ms));

test('should run serial (first)', async () => {
  await wait(100);
  assert(true);
});

test('should run serial (last)', async () => {
  await wait(0);
  assert(true);
});
```

```
$ bron --serial
✔ should run serial (first)
✔ should run serial (last)
```

### promises

Return a promise, and the test will pass (resolved) or fail (rejected).

```js
const addAsync = (x, y) => (x && y ? Promise.resolve(x + y) : Promise.reject('no can do'));

test('should pass with resolved promise', () => {
  return addAsync(1, 2);
});

test('should fail with rejected promise', () => {
  return addAsync(1);
});
```

```
$ bron
✔ should pass with resolved promise
✖ should fail with rejected promise
no can do

✖ 1 test(s) failed.
✔ 1 test(s) passed.
```
