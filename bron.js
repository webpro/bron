#!/usr/bin/env node

import { EOL } from 'os';
import { existsSync } from 'fs';
import { run } from './index.js';

const args = process.argv.slice(2);
const files = args.filter(existsSync);
const isSerial = args.some(arg => arg === '--serial');
const timeout = parseInt(/(?<=--timeout[ =])[0-9]+/.exec(args.join(' ')), 10) || 15000;

run({ files, isSerial, timeout })
  .then(({ total, failed, passed }) => {
    const summary = [];
    const completed = failed + passed;

    if (total - completed !== 0) {
      summary.push(`! ${total - completed} test(s) not executed`);
    }
    if (failed) {
      summary.push(`✖ ${failed} test(s) failed`);
    }
    summary.push(`✔ ${passed} test(s) passed`);

    console.log(EOL + summary.join(EOL));

    process.exit(failed ? 1 : 0);
  })
  .catch(console.error);
