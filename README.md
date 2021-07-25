# bron

Tiny test runner for Node.js

- Single `test()` function, plus [.skip()](#skip) and [.only()](#only)
- No magic, no implicit globals, no separate processes, no dependencies
- Use the Node.js [built-in assert](https://nodejs.org/api/assert.html) module, or bring your own (e.g.
  [chai](https://www.chaijs.com), [should.js](https://github.com/shouldjs/should.js))
- Run tests in parallel (default), or serial
- Timeouts (default: 15s)
- Requires Node.js v12.20+
- Written in/published as pure ES Modules

[![Build Status](https://travis-ci.org/webpro/bron.svg?branch=master)](https://travis-ci.org/webpro/bron)
[![npm version](https://badge.fury.io/js/bron.svg)](https://www.npmjs.com/package/bron)

## Why?

Often for small projects, test suites consist of some wrapped assertions in `test` or `it` functions. Node.js has a fine
`assert` module built-in, while exception output is pretty since Node v12. Last but not least, if any test fails, the
process should exit with a non-zero code so that CI/CD environments can act accordingly.

Turns out this isn't very hard to implement, all source code of bron combined is only <100 LOC. In case you need more
from your test framework, I'm happy to recommend one of the more full fledged options:

| Runner         | Dependencies |  Size |
| -------------- | :----------: | ----: |
| Bron (v1.1.0)  |      0       |    5K |
| Tape (v4.11.0) |      32      |  265K |
| Mocha (v6.2.0) |     116      | 1.53M |
| Ava (v2.2.0)   |     387      | 3.68M |

## Not featuring...

- Extensive command-line options
- TAP reporting
- Fancy colors
- Setup/teardown helpers (e.g. `beforeEach`, `after`)
- Browser support

## Installation

```
npm install bron -D
```

Add a `test` script to run the tests (`npm test`), e.g.:

```json
{
  "scripts": {
    "test": "bron test/*.js"
  }
}
```

## Usage from CLI

```
bron <file> [--serial] [--timeout=ms]
```

## Writing tests

### sync

```js
import test from 'bron';
import { strict as assert } from 'assert';

const add = (x, y) => x + y;

test('should pass', () => {
  assert.equal(add(1, 2), 3);
});

test('should fail', () => {
  assert.equal(add(1, 2), 4);
});
```

```
$ bron test.js
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
const isTwoAsync = x => (x === 2 ? Promise.resolve('OK') : Promise.reject('NOT OK'));

test('should pass with resolved promise', () => {
  assert.doesNotReject(() => isTwoAsync(2));
});

test('should pass with rejected promise', () => {
  assert.rejects(() => isTwoAsync(10), /NOT OK/);
});
```

### serial

Add `--serial`:

```js
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

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
const isTwoAsync = x => (x === 2 ? Promise.resolve('OK') : Promise.reject('NOT OK'));

test('should pass with resolved promise', () => {
  return isTwoAsync(2);
});

test('should fail with rejected promise', () => {
  return isTwoAsync(10);
});
```

```
$ bron
✔ should pass with resolved promise
✖ should fail with rejected promise
NOT OK

✖ 1 test(s) failed.
✔ 1 test(s) passed.
```

### .skip

```js
test.skip('should be skipped', () => {
  assert.equal(1, 1);
});
```

### .only

```js
test.only('should pass', () => {
  assert.equal(1, 1);
});

test('should be skipped', () => {
  assert.equal(1, 1);
});
```

You can use `.only` multiple times (each `.only` will run).

## Timeout

Add `--timeout=n` (with `n` in milliseconds) to change the default value for each test (`15000`).
