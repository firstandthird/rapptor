'use strict';
const Rapptor = require('../');
const Code = require('code'); // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#routes', () => {
  const rapptor = new Rapptor({
    cwd: __dirname
  });

  lab.before(async () => {
    await rapptor.start();
  });

  lab.test('should automatically load routes from the appropriate folder', async() => {
    const server = rapptor.server;
    const response = await server.inject({
      method: 'GET',
      url: '/example'
    });
    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.equal('this is an example');
  });

  lab.test('should automatically load routes from the appropriate folder', async() => {
    const server = rapptor.server;
    const response = await server.inject({
      method: 'GET',
      url: '/example'
    });
    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.equal('this is an example');
  });

  lab.after(async() => {
    await rapptor.stop();
  });
});

lab.experiment('Rapptor#routes log requests', () => {
  let rapptor;

  lab.test('should log request with hapi-log-response if ENV.ACCESS_LOGS is true', async() => {
    process.env.ACCESS_LOGS = 'true';
    rapptor = new Rapptor({
      cwd: __dirname
    });
    const { server } = await rapptor.start();
    server.events.on('log', async(event, tags) => {
      if (tags.server) {
        return;
      }
      Code.expect(event.tags).to.contain('detailed-response');
      Code.expect(event.data.path).to.contain('/example');
      await rapptor.stop();
    });
    const response = await server.inject({
      method: 'GET',
      url: '/example'
    });
    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.equal('this is an example');
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(500);
  });

  lab.test('does not log request if ENV.ACCESS_LOGS is not true', async() => {
    process.env.ACCESS_LOGS = undefined;
    rapptor = new Rapptor({
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
    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.equal('this is an example');
    Code.expect(shouldBeEmpty.length).to.equal(0);
    await rapptor.stop();
  });

  lab.test('does not log request for invalid cookie errors', async() => {
    rapptor = new Rapptor({
      cwd: __dirname
    });
    await rapptor.start();
    rapptor.server.state('a', { strictHeader: true });
    const response = await rapptor.server.inject({
      method: 'GET',
      headers: { cookie: 'a=x y;' },
      url: '/invalidCookie'
    });
    Code.expect(response.statusCode).to.equal(200);
    await rapptor.stop();
  });
});

lab.experiment('Rapptor#require https routes', () => {
  process.env.FORCE_HTTPS = 'true';
  const rapptor = new Rapptor({
    cwd: __dirname
  });

  lab.before(async() => {
    await rapptor.start();
  });

  lab.test('should forward non-https routes to https', async() => {
    const server = rapptor.server;
    const response = await server.inject({
      method: 'GET',
      headers: {
        'x-forwarded-proto': 'http'
      },
      url: '/example'
    });
    Code.expect(response.headers.location).to.include('https://');
    Code.expect(response.statusCode).to.equal(301);
  });

  lab.after(async() => {
    await rapptor.stop();
  });
});
