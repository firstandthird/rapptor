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

tap.test('will log unhandled promises and stop the server', async t => {
  process.removeAllListeners('unhandledRejection');
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { server } = await rapptor.start();
  let stopped = false;
  server.events.on('stop', () => {
    stopped = true;
  });
  Promise.reject(new Error('rapptorTesting'));
  await new Promise(resolve => setTimeout(resolve, 500));
  t.ok(stopped, 'the Promise rejection stopped the server');
  t.end();
});

tap.test('server stops when SIGTERM event is emitted ', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  await rapptor.start();
  // server will stop and test will exit:
  process.emit('SIGTERM');
});
