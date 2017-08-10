'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#setup', () => {
  lab.test('default options', (done) => {
    const rapptor = new Rapptor();
    rapptor.start((err) => {
      Code.expect(err).to.equal(undefined);
      done();
    });
  });

  lab.test('accept a cwd', (done) => {
    const rapptor = new Rapptor({
      cwd: __dirname
    });
    rapptor.start(() => {
      const raptConfig = rapptor.config;
      // should load config from tests/conf
      Code.expect(raptConfig.assets.host).to.equal('http://localhost:8080');
      Code.expect(raptConfig.connection.port).to.equal('8080');
      Code.expect(raptConfig.server.debug).to.equal(false);
      Code.expect(raptConfig.testValue).to.equal('123ABC');
      done();
    });
  });

  lab.test('auto-loads rapptor-prefixed configs in cwd', (done) => {
    const rapptor = new Rapptor({
      cwd: __dirname
    });
    rapptor.start(() => {
      const raptConfig = rapptor.config;
      Code.expect(raptConfig.rapptorValue).to.equal('rapptor!');
      done();
    });
  });

  lab.test('accept a configPath', (done) => {
    const rapptor = new Rapptor({
      configPath: `${__dirname}/conf2`
    });
    rapptor.start(() => {
      const raptConfig = rapptor.config;
      Code.expect(raptConfig.connection.port).to.equal('8080');
      Code.expect(raptConfig.testValue).to.equal('conf2!');
      done();
    });
  });

  lab.test('both cwd and configPath', (done) => {
    const rapptor = new Rapptor({
      cwd: __dirname,
      configPath: `${__dirname}/conf2`
    });
    rapptor.start(() => {
      const raptConfig = rapptor.config;
      Code.expect(raptConfig.testValue).to.equal('conf2!');
      done();
    });
  });
});
