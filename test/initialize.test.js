'use strict';
const Rapptor = require('../');
const tap = require('tap');

tap.test('initializes a new instance of rapptor', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  t.equal(typeof rapptor, 'object');
  t.equal(typeof rapptor.start, 'function');
  t.equal(typeof rapptor.setup, 'function');
  const { server, config } = await rapptor.start();
  t.equal(typeof server, 'object');
  t.equal(typeof config, 'object');
  await rapptor.stop();
});

tap.test('can config a new instance of rapptor without starting the server', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { server, config } = await rapptor.setup();
  t.equal(typeof server, 'object');
  t.equal(typeof config, 'object');
  // verify server isn't started yet:
  t.equal(server.info.started, 0);
});

tap.test('server stops when SIGTERM event is emitted ', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  await rapptor.start();
  // server will stop and test will exit:
  process.emit('SIGTERM');
});
