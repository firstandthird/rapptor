'use strict';
const Rapptor = require('../');
const tap = require('tap');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

tap.test('should automatically load routes from the appropriate folder', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname
  });
  await rapptor.start();
  const server = rapptor.server;
  const response = await server.inject({
    method: 'GET',
    url: '/example'
  });
  t.equal(response.statusCode, 200, 'route is available');
  t.equal(response.result, 'this is an example', 'route returns correct result');
  await rapptor.stop();
});

tap.test('should log request with hapi-log-response if ENV.ACCESS_LOGS is true', async t => {
  process.env.ACCESS_LOGS = 'true';
  const rapptor = new Rapptor({
    cwd: __dirname
  });
  const { server } = await rapptor.start();
  let called = false;
  server.events.on('log', (event, tags) => {
    if (called) {
      return;
    }
    called = true;
    t.equal(tags['detailed-response'], true, 'hapi-log-response includes detailed-response tag');
    t.match(event.data.path, '/example', 'hapi-log-response includes the requested path');
  });
  const response = await server.inject({
    method: 'GET',
    url: '/example'
  });
  t.equal(response.statusCode, 200);
  t.equal(response.result, 'this is an example');
  await wait(500);
  await rapptor.stop();
  t.equal(called, true);
});

tap.test('does not log request if ENV.ACCESS_LOGS is not true', async t => {
  process.env.ACCESS_LOGS = undefined;
  const rapptor = new Rapptor({
    cwd: __dirname
  });
  const { server } = await rapptor.start();
  const shouldBeEmpty = [];
  console.log = (msg) => {
    shouldBeEmpty.push(msg);
  };
  const response = await server.inject({
    method: 'GET',
    url: '/example'
  });
  t.equal(response.statusCode, 200, 'returns correct status code');
  t.equal(response.result, 'this is an example', 'returns correct result');
  t.equal(shouldBeEmpty.length, 0, 'will not post a detailed-response when ACCESS_LOGS is off');
  await rapptor.stop();
});

tap.test('does not log request for invalid cookie errors', async t => {
  const rapptor = new Rapptor({
    cwd: __dirname
  });
  await rapptor.start();
  rapptor.server.state('a', { strictHeader: true });
  const shouldBeEmpty = [];
  console.log = (msg) => {
    shouldBeEmpty.push(msg);
  };
  const response = await rapptor.server.inject({
    method: 'GET',
    headers: { cookie: 'a=x y;' },
    url: '/invalidCookie'
  });
  t.equal(response.statusCode, 200);
  await wait(500);
  t.equal(shouldBeEmpty.length, 0, 'will not post a detailed-response for invalid cookie errors');
  await rapptor.stop();
});

tap.test('should forward non-https routes to https', async t => {
  process.env.FORCE_HTTPS = 'true';
  const rapptor = new Rapptor({
    cwd: __dirname
  });
  await rapptor.start();
  const server = rapptor.server;
  const response = await server.inject({
    method: 'GET',
    headers: {
      'x-forwarded-proto': 'http'
    },
    url: '/example'
  });
  t.match(response.headers.location, 'https://', 'forwards to https');
  t.equal(response.statusCode, 301, 'uses redirect status code');
  await rapptor.stop();
});
