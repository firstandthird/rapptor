'use strict';
const Rapptor = require('../');
const tap = require('tap');

tap.test('default options', async t => {
  const rapptor = new Rapptor();
  await rapptor.start();
  await rapptor.stop();
});

tap.test('accept a cwd', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname
  });
  await rapptor.start();
  const raptConfig = rapptor.config;
  // should load config from tests/conf
  t.equal(raptConfig.assets.host, 'http://localhost:8080', 'loads the values in test/conf/default.yaml');
  t.equal(raptConfig.connection.port, 8080, 'loads the values in test/conf/default.yaml');
  t.equal(raptConfig.server.debug, false, 'loads the values in test/conf/default.yaml');
  t.equal(raptConfig.testValue, '123ABC', 'loads the values in test/conf/default.yaml');
  await rapptor.stop();
});

tap.test('auto-loads rapptor-prefixed configs in cwd', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname
  });
  await rapptor.start();
  const raptConfig = rapptor.config;
  t.equal(raptConfig.rapptorValue, 'rapptor!', 'loaded the value from rapptor.yaml');
  await rapptor.stop();
});

tap.test('accept a configPath', async t => {
  const rapptor = new Rapptor({
    configPath: `${__dirname}/conf2`
  });
  await rapptor.start();
  const raptConfig = rapptor.config;
  t.equal(raptConfig.connection.port, '9999', 'loads the values in test/conf2/default.yaml');
  t.equal(raptConfig.testValue, 'conf2!', 'loads the values in test/conf2/default.yaml');
  await rapptor.stop();
});

tap.test('both cwd and configPath', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname,
    configPath: `${__dirname}/conf2`
  });
  await rapptor.start();
  const raptConfig = rapptor.config;
  t.equal(raptConfig.testValue, 'conf2!', 'loads the values in test/conf2/default.yaml');
  await rapptor.stop();
});

tap.test('will throw error if invalid yaml', async t => {
  const rapptor = new Rapptor({
    configPath: `${__dirname}/broken`
  });
  try {
    await rapptor.start();
  } catch (e) {
    t.notEqual(e, null, 'throws an error when config is invalid');
    t.match(e.toString(), 'YAMLException:', 'error is thrown by the config parser');
    return;
  }
  throw new Error('rapptor should throw YAML error');
});

tap.test('support ROUTE_PREFIX', async t => {
  process.env.ROUTE_PREFIX = '/aRandomRoutePrefix';
  const rapptor = new Rapptor({ cwd: __dirname });
  const { server } = await rapptor.setup();
  server.table().forEach(route => {
    t.ok(route.path.startsWith('/aRandomRoutePrefix/'), 'every route starts with ROUTE_PREFIX');
  });
  await rapptor.stop();
});

tap.test('support SLOW_THRESHOLD', async t => {
  process.env.TIMING = 1;
  process.env.SLOW_THRESHOLD = 10;
  const rapptor = new Rapptor({ cwd: __dirname });
  const { server } = await rapptor.setup();
  server.route({
    method: 'get',
    path: '/testTiming',
    async handler(request, h) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ok: true };
    }
  });
  let called = false;
  server.events.on('log', (input, tags) => {
    if (called) {
      return;
    }
    called = true;
    t.ok(tags['hapi-timing'], 'slow responses generate a hapi-timing log');
    t.isA(input.data.responseTime, 'number', 'shows how long the request took');
    t.equal(input.data.threshold, 10, 'shows the allowed threshold for processing a request');
  });
  await server.start();
  await server.inject({ url: '/testTiming' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  t.ok(called, 'hapi-timing called the slow response event');
  await rapptor.stop();
});

tap.test('support CACHE_STATS', async t => {
  process.env.CACHE_STATS = 200;
  const rapptor = new Rapptor({ cwd: __dirname });
  const { server } = await rapptor.setup();
  const cacheTest = () => new Date().getTime();
  server.method('cacheTest', cacheTest, { cache: { expiresIn: 1000, generateTimeout: 100 } });
  let called = false;
  server.events.on('log', (input, tags) => {
    if (!tags['hapi-cache-stats']) {
      return;
    }
    called = true;
    t.ok(tags['hapi-cache-stats'], 'hapi-cache-stats logs cache info');
    t.ok(tags.cacheTest, 'hapi-cache-stats reports the method name');
    t.ok(tags.warning, 'hapi-cache-stats throws a warning tag if hit ratio is too low');
    t.isA(input.timestamp, 'number', 'hapi-cache-stats reports the timestamp');
    t.equal(input.data, 'Hit ratio of 0 is lower than threshold of 0.5');
  });
  await server.start();
  server.methods.cacheTest();
  server.methods.cacheTest();
  server.methods.cacheTest();
  await new Promise(resolve => setTimeout(resolve, 3000));
  await rapptor.stop();
  t.ok(called, 'hapi-cache-stats logged info');
});

tap.test('support OPS_INTERVAL', async t => {
  process.env.OPS_INTERVAL = 200;
  const rapptor = new Rapptor({ cwd: __dirname });
  const { server } = await rapptor.setup();
  await rapptor.start();
  let called = false;
  server.events.on('log', (input, tags) => {
    if (called) {
      return;
    }
    called = true;
    t.ok(tags.ops, 'ops logs info at specified interval');
    t.ok(tags.requests, 'ops logs requests data');
  });
  server.route({
    method: 'get',
    path: '/route',
    handler(request, h) {
      return { hi: 'there' };
    }
  });
  await server.inject({ url: '/route' });
  await new Promise(resolve => setTimeout(resolve, 3000));
  await rapptor.stop();
  t.ok(called, 'ops logged info during the specified interval');
});
