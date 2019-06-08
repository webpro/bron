const { types } = require('util');
const path = require('path');

const isPromise = types && types.isPromise ? types.isPromise : p => p && typeof p.then === 'function';

let tests, only, results;
let passed, failed, skipped;

const createHandlers = title => [
  () => {
    passed++;
    console.log(`✔ ${title}`);
  },
  err => {
    failed++;
    console.log(`✖ ${title}`);
    console.error(err);
  }
];

const execute = async ({ tests, isSerial }) => {
  for (const index in tests) {
    const [title, testFn] = tests[index];
    const [pass, fail] = createHandlers(title);
    try {
      const testResult = isSerial ? await testFn() : testFn();
      results.push(testResult);
      if (isPromise(testResult)) {
        testResult.then(pass).catch(fail);
      } else {
        pass();
      }
    } catch (err) {
      fail(err);
    }
  }
};

const run = async ({ files, isSerial }) => {
  [tests, results, only] = [[], [], []];
  [passed, failed, skipped] = [0, 0, 0];

  files.forEach(file => require(path.resolve(file)));

  await execute({ tests: only.length ? only : tests, isSerial });

  await Promise.all(results).catch(err => {});

  const total = tests.length + only.length + skipped;
  return { total, failed, passed };
};

module.exports = (title, testFn) => tests.push([title, testFn]);

module.exports.run = run;

module.exports.skip = (title, testFn) => skipped++;
module.exports.only = (title, testFn) => only.push([title, testFn]);
