const path = require('path');
const { types } = require('util');
const { EOL } = require('os');

const isPromise = types && types.isPromise ? types.isPromise : p => p && typeof p.then === 'function';

const [tests, results, passed, failed, summary] = [[], [], [], [], []];

const createHandlers = title => [
  () => {
    passed.push(title);
    console.log(`✔ ${title}`);
  },
  err => {
    failed.push(title);
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

const run = async () => {
  const args = process.argv.slice(2);
  const files = args.filter(file => file !== '--serial');
  const isSerial = args.some(arg => arg === '--serial');

  files.forEach(file => require(path.resolve(file)));

  await execute({ tests, isSerial });

  await Promise.all(results).catch(err => {
    if (tests.length - failed.length - passed.length !== 0) {
      summary.push(`? ${tests.length - failed.length - passed.length} test(s) not executed`);
    }
  });

  if (failed.length) {
    summary.push(`✖ ${failed.length} test(s) failed`);
  }
  summary.push(`✔ ${passed.length} test(s) passed`);

  console.log(EOL + summary.join(EOL));

  process.exit(failed.length ? 1 : 0);
};

module.exports = (title, testFn) => tests.push([title, testFn]);

module.exports.run = run;
