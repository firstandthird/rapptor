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

tap.test('be able to conditionally load hapi-timing plugin', async t => {
  process.env.TIMING = true;
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { server, config } = await rapptor.setup();
  t.notEqual(config.plugins['hapi-timing']._enabled, false, 'loads hapi-timing');
  t.equal(server.events._eventListeners.response.handlers.length, 2, 'registers hapi-timing event handler');
  await rapptor.stop();
  t.end();
});

tap.test('be able to conditionally load hapi-cache-stats plugin', async t => {
  process.env.CACHE_STATS = true;
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { server, config } = await rapptor.setup();
  t.notEqual(config.plugins['hapi-cache-stats']._enabled, false, 'loads hapi-cache-stats');
  t.equal(server.events._eventListeners.response.handlers.length, 2, 'registers hapi-cache-stats event handler');
  await rapptor.stop();
  t.end();
});

tap.test('be able to conditionally load hapi-require-https plugin', async t => {
  process.env.FORCE_HTTPS = true;
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { config } = await rapptor.setup();
  t.notEqual(config.plugins['hapi-require-https']._enabled, false, 'loads hapi-require-https');
  await rapptor.stop();
  t.end();
});

tap.test('be able to conditionally load hapi-oppsy plugin', async t => {
  process.env.OPS_INTERVAL = 5;
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { server, config } = await rapptor.setup();
  t.notEqual(config.plugins['hapi-oppsy']._enabled, false, 'loads hapi-oppsy');
  t.equal(server.events._eventListeners.stop.handlers.length, 2, 'registers hapi-oppsy event handler');
  await rapptor.stop();
  t.end();
});
