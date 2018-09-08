'use strict';
const Rapptor = require('../');
const tap = require('tap');
const expected = require('./expectedOutput.js');

tap.test('initializes a new instance of rapptor', async t => {
  process.env.LOG_TYPE = 'wood';
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  t.equal(typeof rapptor, 'object');
  t.equal(typeof rapptor.start, 'function');
  t.equal(typeof rapptor.setup, 'function');
  const { server, config } = await rapptor.start();
  t.equal(typeof server, 'object');
  t.equal(typeof config, 'object');
  t.match(config, expected, 'loads config');
  t.equal(config.envVars.logType, 'wood', 'loads env vars correctly');
  await rapptor.stop();
  t.end();
});

tap.test('be able to load a config with setup', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  t.equal(typeof rapptor, 'object');
  t.equal(typeof rapptor.start, 'function');
  t.equal(typeof rapptor.setup, 'function');
  const { server, config } = await rapptor.setup();
  t.equal(typeof server, 'object');
  t.equal(typeof config, 'object');
  t.match(config, expected, 'loads config');
  t.equal(config.envVars.logType, 'wood', 'loads env vars correctly');
  await rapptor.stop();
  t.end();
});

tap.test('be able to load a config from directory', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
    configPath: `${__dirname}/conf`
  });
  t.equal(typeof rapptor, 'object');
  t.equal(typeof rapptor.start, 'function');
  t.equal(typeof rapptor.setup, 'function');
  const { server, config } = await rapptor.setup();
  t.equal(typeof server, 'object');
  t.equal(typeof config, 'object');
  t.match(config, expected, 'loads config');
  t.equal(config.someValue, 'also', 'loads additional config');
  await rapptor.stop();
  t.end();
});

tap.test('server stops when SIGTERM event is emitted ', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  await rapptor.start();
  const oldExit = process.exit;
  process.exit = sig => {
    t.equal(sig, 0);
    process.exit = oldExit;
  };
  // server will stop and test will exit:
  process.emit('SIGTERM');
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  await wait(2000);
});
