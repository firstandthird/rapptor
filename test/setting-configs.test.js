'use strict';
const Rapptor = require('../');
const Code = require('code'); // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#setup', () => {
  lab.test('default options', async() => {
    const rapptor = new Rapptor();
    await rapptor.start();
    await rapptor.stop();
  });

  lab.test('accept a cwd', async() => {
    const rapptor = new Rapptor({
      cwd: __dirname
    });
    await rapptor.start();
    const raptConfig = rapptor.config;
    // should load config from tests/conf
    Code.expect(raptConfig.assets.host).to.equal('http://localhost:8080');
    Code.expect(raptConfig.connection.port).to.equal(8080);
    Code.expect(raptConfig.server.debug).to.equal(false);
    Code.expect(raptConfig.testValue).to.equal('123ABC');
    await rapptor.stop();
  });

  lab.test('auto-loads rapptor-prefixed configs in cwd', async() => {
    const rapptor = new Rapptor({
      cwd: __dirname
    });
    await rapptor.start();
    const raptConfig = rapptor.config;
    Code.expect(raptConfig.rapptorValue).to.equal('rapptor!');
    await rapptor.stop();
  });

  lab.test('accept a configPath', async() => {
    const rapptor = new Rapptor({
      configPath: `${__dirname}/conf2`
    });
    await rapptor.start();
    const raptConfig = rapptor.config;
    Code.expect(raptConfig.connection.port).to.equal('8080');
    Code.expect(raptConfig.testValue).to.equal('conf2!');
    await rapptor.stop();
  });

  lab.test('both cwd and configPath', async() => {
    const rapptor = new Rapptor({
      cwd: __dirname,
      configPath: `${__dirname}/conf2`
    });
    await rapptor.start();
    const raptConfig = rapptor.config;
    Code.expect(raptConfig.testValue).to.equal('conf2!');
    await rapptor.stop();
  });

  lab.test('will throw error if invalid yaml', async() => {
    const rapptor = new Rapptor({
      configPath: `${__dirname}/broken`
    });
    try {
      await rapptor.start();
    } catch (e) {
      Code.expect(e).to.not.equal(null);
      Code.expect(e.toString().startsWith('YAMLException:')).to.equal(true);
      return;
    }
    throw new Error('rapptor should throw YAML error');
  });

  lab.test('support ROUTE_PREFIX', async() => {
    process.env.ROUTE_PREFIX = '/aRandomRoutePrefix';
    const rapptor = new Rapptor({ cwd: __dirname });
    const { server } = await rapptor.setup();
    server.table().forEach(route => {
      Code.expect(route.path.startsWith('/aRandomRoutePrefix/')).to.equal(true);
    });
  });

  lab.test('support SLOW_THRESHOLD', { timeout: 5000 }, async() => {
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
      called = true;
      Code.expect(tags['hapi-timing']).to.equal(true);
      Code.expect(typeof input.data.responseTime).to.equal('number');
      Code.expect(input.data.threshold).to.equal(10);
      Code.expect(typeof input.data.responseTime).to.equal('number');
      Code.expect(input.data.message).to.include('request took');
      Code.expect(input.data.message).to.include('ms to process');
    });
    await server.start();
    await server.inject({ url: '/testTiming' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    Code.expect(called).to.equal(true);
    await rapptor.stop();
  });

  lab.test('support CACHE_STATS', { timeout: 5000 }, async() => {
    process.env.CACHE_STATS = 200;
    const rapptor = new Rapptor({ cwd: __dirname });
    const { server } = await rapptor.setup();
    const cacheTest = () => new Date().getTime();
    server.method('cacheTest', cacheTest, { cache: { expiresIn: 1000, generateTimeout: 100 } });
    server.events.on('log', (input, tags) => {
      Code.expect(tags['hapi-cache-stats']).to.equal(true);
      Code.expect(tags.cacheTest).to.equal(true);
      Code.expect(tags.warning).to.equal(true);
      Code.expect(typeof input.timestamp).to.equal('number');
      Code.expect(input.data).to.equal('Hit ratio of 0 is lower than threshold of 0.5');
    });
    await server.start();
    server.methods.cacheTest();
    server.methods.cacheTest();
    server.methods.cacheTest();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await rapptor.stop();
  });
});
