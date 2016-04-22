#!/usr/bin/env node
'use strict';
const Rapptor = require('../');

const cwd = process.cwd();
const rapptor = new Rapptor({
  configPath: `${cwd}/conf`,
  cwd
});

rapptor.start((err, server, config) => {
  if (err) {
    throw err;
  }
});
