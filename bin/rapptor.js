#!/usr/bin/env node
'use strict';
const Rapptor = require('../');
const path = require('path');

let cwd = process.cwd();
if (process.argv.length === 3) {
  cwd = path.resolve(cwd, process.argv[2]);
}
const main = async function() {
  const rapptor = new Rapptor({
    configPath: `${cwd}/conf`,
    cwd
  });

  try {
    await rapptor.start();
  } catch (e) {
    console.error(e.stack || e.message); //eslint-disable-line no-console
    process.exit(1);
  }
};
main();
