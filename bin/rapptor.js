#!/usr/bin/env node
'use strict';
const Rapptor = require('../');

const cwd = process.cwd();
let justConfig = false;

if (process.argv.length >= 3 && process.argv[2] === 'config') {
  justConfig = true;
}

const main = async function() {
  const rapptor = new Rapptor({
    configPath: `${cwd}/conf`,
    cwd
  });
  try {
    if (justConfig) {
      const { config } = await rapptor.setup();
      console.log(JSON.stringify(config, null, 2)); //eslint-disable-line no-console
    } else {
      await rapptor.start();
    }
  } catch (e) {
    console.error(e.stack || e.message); //eslint-disable-line no-console
    process.exit(1);
  }
};
main();
