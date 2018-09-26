'use strict';
const Rapptor = require('../');
const tap = require('tap');
const expected = require('./expectedOutput.js');

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
  t.match(config, expected, 'loads config');
  await rapptor.stop();
  t.end();
});

tap.test('initializes a new instance of rapptor', async t => {
  process.env.HEALTH_TOKEN = 'wood';
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  t.equal(typeof rapptor, 'object');
  t.equal(typeof rapptor.start, 'function');
  t.equal(typeof rapptor.setup, 'function');
  const { server, config } = await rapptor.start();
  t.equal(typeof server, 'object');
  t.equal(typeof config, 'object');
  t.equal(config.envVars.healthToken, 'wood', 'loads env vars correctly');
  await rapptor.stop();
  delete process.env.HEALTH_TOKEN;
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

tap.test('be able to conditionally load hapi-prom', async t => {
  process.env.ENABLE_PROM = true;
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  await rapptor.start();
  const response = await rapptor.server.inject({
    method: 'get',
    url: '/metrics'
  });
  t.equal(response.statusCode, 200, 'registers hapi-prom route');
  await rapptor.stop();
  t.end();
});

tap.test('by default hapi-logr will load logr-logfmt reporter', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { server } = await rapptor.start();
  const oldLog = console.log;
  const logs = [];
  console.log = (data) => {
    logs.push(data);
  };
  server.log(['start'], 'hi there');
  console.log = oldLog;
  t.match(logs[0], '\u001b[90m[\u001b[39m\u001b[31mstart\u001b[39m\u001b[90m]\u001b[39m hi there');
  await rapptor.stop();
  t.end();
});

tap.test('be able to conditionally load hapi-require-https plugin', async t => {
  process.env.FORCE_HTTPS = true;
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  const { config } = await rapptor.start();
  t.notEqual(config.plugins['hapi-require-https']._enabled, false, 'loads hapi-require-https');
  await rapptor.stop();
  t.end();
});
