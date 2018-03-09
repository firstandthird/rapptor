'use strict';
const Rapptor = require('../');
const tap = require('tap');

tap.test('should automatically load methods from the appropriate folder', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
    configPath: `${__dirname}/conf`
  });
  await rapptor.start();
  const server = rapptor.server;
  t.equal(typeof server.methods.randomNumber, 'function');
  const value = await server.methods.randomNumber();
  t.equal(typeof value, 'number');
  await rapptor.stop();
});
