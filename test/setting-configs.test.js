'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const loadConfig = require('confi');

lab.experiment('Rapptor#setup', () => {
  lab.test('should have a base set of configurations', (done) => {
    const rapptor = new Rapptor({
      cwd: __dirname
    });
    const config = loadConfig('./conf/default.yaml');
    loadConfig.reset();
    rapptor.start(() => {
      Code.expect(config.connection.port).to.equal(rapptor.config.connection.port);
      Code.expect(config.connection.address).to.equal(rapptor.config.connection.address);
      console.log('......');
      console.log(Object.keys(config));
      console.log(Object.keys(rapptor.config));
      Code.expect(config.assets).to.equal(rapptor.config.assets);
      Code.expect(config.mongo.host).to.equal(rapptor.config.mongo.host);
      Code.expect(config.mongo.db).to.equal(rapptor.config.mongo.db);
      Code.expect(config.mongo.port).to.equal(rapptor.config.mongo.port);
      rapptor.stop(done);
    });
  });

  // lab.test('should accept an object for configurations', (done) => {
  //   const rapptor = new Rapptor({
  //     cwd: __dirname
  //   });
  //   const raptConfig = rapptor.config;
  //   Code.expect(raptConfig.assets.host).to.equal('http://localhost:8080');
  //   Code.expect(raptConfig.connection.port).to.equal(8080);
  //   Code.expect(raptConfig.testValue).to.equal('123ABC');
  //   done();
  // });
});
