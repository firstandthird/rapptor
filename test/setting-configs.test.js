'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const loadConfig = require('confi');

lab.experiment('Rapptor#setup', () => {
  lab.test('should have a base set of configurations', (done) => {
    const rapptor = new Rapptor();
    const config = loadConfig('./conf/default.yaml');
    loadConfig.reset();
    rapptor.start(() => {
      Code.expect(config.connection.port).to.equal(rapptor.config.connection.port);
      Code.expect(config.connection.address).to.equal(rapptor.config.connection.address);
      Code.expect(config.assets).to.equal(rapptor.config.assets);
      rapptor.stop(done);
    });
  });

  lab.test('should accept an object for configurations', (done) => {
    const rapptor = new Rapptor({
      cwd: __dirname
    });
    rapptor.start(() => {
      const raptConfig = rapptor.config;
      Code.expect(raptConfig.assets.host).to.equal('http://localhost:8888');
      Code.expect(raptConfig.connection.port).to.equal('8888');
      Code.expect(raptConfig.server.debug).to.equal(false);
      Code.expect(raptConfig.testValue).to.equal('123ABC');
      done();
    });
  });
});
