/* eslint-disable no-console */
'use strict';
const Rapptor = require('../');

const rapptor = new Rapptor({
  configPath: `${__dirname}/conf`,
  cwd: __dirname
});

rapptor.start((err, server, config) => {
  if (err) {
    throw err;
  }
  console.log('Server Started', server.info.uri);
});
