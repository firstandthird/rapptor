#!/usr/bin/env node
'use strict';
const Rapptor = require('../');
const path = require('path');

let cwd = process.cwd();
if (process.argv.length === 3) {
  cwd = path.resolve(cwd, process.argv[2]);
}
const rapptor = new Rapptor({
  configPath: `${cwd}/conf`,
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
