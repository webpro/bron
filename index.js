const { types } = require('util');
const path = require('path');

const isPromise = types && types.isPromise ? types.isPromise : p => p && typeof p.then === 'function';

let tests, only;
let passed, failed, skipped;

const start = ({ title, timeout, resolve }) => {
  let called;
  const end = err => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    if (typeof err !== 'undefined') {
      failed++;
      console.log(`✖ ${title}`);
      console.error(err);
    } else {
      passed++;
      console.log(`✔ ${title}`);
    }
    resolve();
  };
  const timer = setTimeout(end, timeout, new Error(`Test "${title}" timed out after ${timeout}ms`));
  return end;
};

const execute = async ({ tests, isSerial, timeout = 15000 }) => {
  const results = [];
  for (const index in tests) {
    const [title, testFn] = tests[index];
    const test = new Promise(resolve => {
      const end = start({ title, timeout, resolve });
      try {
        const testResult = testFn();
        if (isPromise(testResult)) {
          testResult.then(() => end()).catch(end);
        } else {
          end();
        }
      } catch (err) {
        end(err);
      }
    });
    results.push(isSerial ? await test : test);
  }
  return results;
};

const run = async ({ files, isSerial, timeout }) => {
  [tests, only] = [[], [], []];
  [passed, failed, skipped] = [0, 0, 0];

  files.forEach(file => require(path.resolve(file)));

  const results = await execute({ tests: only.length ? only : tests, isSerial, timeout });

  await Promise.all(results).catch(() => {});

  const total = tests.length + only.length + skipped;
  return { total, failed, passed };
};

module.exports = (title, testFn) => tests.push([title, testFn]);

module.exports.run = run;

module.exports.skip = () => skipped++;
module.exports.only = (title, testFn) => only.push([title, testFn]);
