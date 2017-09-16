#!/usr/bin/env node
'use strict';
const Rapptor = require('../');
const path = require('path');

const argv = require('yargs')
  .option('config', {
    alias: 'c',
    describe: 'path to config',
  }).argv;

const cwd = argv._.length ? path.resolve(process.cwd(), argv._[0]) : process.cwd();
const rapptor = new Rapptor({
  configPath: argv.config ? argv.config : `${cwd}/conf`,
  cwd
});
rapptor.start((err, server, config) => {
  if (process.env.CONFIG === '1') {
    server.log(['info', 'config'], config);
  }
  if (err) {
    throw err;
  }
});
