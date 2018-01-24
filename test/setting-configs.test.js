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
});
