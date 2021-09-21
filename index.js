import { types } from 'util';
import { pathToFileURL } from 'url';

const isPromise = types && types.isPromise ? types.isPromise : p => p && typeof p.then === 'function';

let [tests, _only] = [[], []];
let [passed, failed, skipped] = [0, 0, 0];

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

const test = (title, testFn) => tests.push([title, testFn]);
test.skip = () => skipped++;
test.only = (title, testFn) => _only.push([title, testFn]);

export default test;

export const run = async ({ files, isSerial, timeout }) => {
  [tests, _only] = [[], [], []];
  [passed, failed, skipped] = [0, 0, 0];

  for (const file of files) {
    try {
      await import(pathToFileURL(file));
    } catch (error) {
      tests.push([file, () => Promise.reject(error)]);
    }
  }

  const results = await execute({ tests: _only.length ? _only : tests, isSerial, timeout });

  await Promise.all(results).catch(() => {});

  const total = tests.length + _only.length + skipped;
  return { total, failed, passed };
};
