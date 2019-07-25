const { EOL } = require('os');
const assert = require('assert');
const sinon = require('sinon');
const { run } = require('..');

const logStub = sinon.stub(console, 'log');
const errorStub = sinon.stub(console, 'error');

(async () => {
  try {
    {
      const { total, failed, passed } = await run({ files: ['test/parallel.js'] });

      const output = logStub.args.map(args => args[0]);

      assert.deepEqual(output, ['✔ should pass first', '✔ should pass in-between', '✔ should pass last']);

      assert.equal(total, 3);
      assert.equal(failed, 0);
      assert.equal(passed, 3);

      console.info(output.join(EOL));
    }

    logStub.reset();
    errorStub.reset();

    {
      const { total, failed, passed } = await run({ files: ['test/serial.js'], isSerial: true });

      const output = logStub.args.map(args => args[0]);

      assert.deepEqual(output, [
        '✔ should pass',
        '✖ should fail',
        '✔ should pass with resolved promise',
        '✔ should pass with returned promise',
        '✔ should pass with rejected promise',
        '✔ should pass with resolved promise',
        '✔ should pass with rejected promise',
        '✔ should pass first in serial mode',
        '✔ should pass last in serial mode'
      ]);

      assert.equal(total, 9);
      assert.equal(failed, 1);
      assert.equal(passed, 8);

      console.info(output.join(EOL));
    }

    logStub.reset();
    errorStub.reset();

    {
      const { total, failed, passed } = await run({ files: ['test/error.js'], isSerial: true });

      const output = logStub.args.map(args => args[0]);
      const errorArgs = errorStub.args.map(args => args[0]);

      assert.deepEqual(output, ['✔ should pass', '✖ should fail', '✖ should fail with returned rejected promise']);

      assert(errorArgs[0] instanceof assert.AssertionError);
      assert.strictEqual(errorArgs[0].actual, 3);
      assert.strictEqual(errorArgs[0].expected, 4);

      assert(errorArgs[1] instanceof Error);
      assert.strictEqual(errorArgs[1].message, 'No can do!');

      assert.equal(total, 3);
      assert.equal(failed, 2);
      assert.equal(passed, 1);

      console.info(output.join(EOL));
    }

    logStub.reset();
    errorStub.reset();

    {
      const { total, failed, passed } = await run({ files: ['test/skip.js'] });
      const output = logStub.args.map(args => args[0]);

      assert.deepEqual(output, ['✔ should not be skipped', '✔ should not be skipped']);

      assert.equal(total, 4);
      assert.equal(failed, 0);
      assert.equal(passed, 2);

      console.info(output.join(EOL));
    }

    logStub.reset();
    errorStub.reset();

    {
      const { total, failed, passed } = await run({ files: ['test/only.js'] });
      const output = logStub.args.map(args => args[0]);

      assert.deepEqual(output, ['✔ should not be skipped', '✔ should not be skipped']);

      assert.equal(total, 4);
      assert.equal(failed, 0);
      assert.equal(passed, 2);

      console.info(output.join(EOL));
    }

    logStub.reset();
    errorStub.reset();

    {
      const { total, failed, passed } = await run({ files: ['test/timeout.js'], timeout: 100 });
      const output = logStub.args.map(args => args[0]);

      assert.deepEqual(output, [
        '✔ should not time out',
        '✔ should not time out (1ms)',
        '✔ should not time out (50ms)',
        '✖ should time out (150ms)',
        '✖ should time out (150ms)'
      ]);

      assert.equal(total, 5);
      assert.equal(failed, 2);
      assert.equal(passed, 3);

      console.info(output.join(EOL));
    }
  } catch (err) {
    console.warn(err);
    process.exit(1);
  }
})();
