'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#setup', () => {
  lab.test('should have a base set of configurations', (done) => {
    const rapptor = new Rapptor();
    rapptor.start(() => {
      Code.expect(rapptor.config.connection.port).to.equal(1234);
      Code.expect(rapptor.config.connection.address).to.equal('0.0.0.0');
      rapptor.stop(done);
    });
  });

  lab.test('should accept an object for configurations', (done) => {
    const rapptor = new Rapptor({
      cwd: __dirname,
      configPath: `${__dirname}/conf`
    });
    rapptor.start(() => {
      const raptConfig = rapptor.config;
      Code.expect(raptConfig.assets.host).to.equal('http://localhost:8080');
      Code.expect(raptConfig.connection.port).to.equal(8080);
      Code.expect(raptConfig.server.debug).to.equal(false);
      Code.expect(raptConfig.testValue).to.equal('123ABC');
      done();
    });
  });
});
