'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#setup', () => {
  lab.test('default options', (done) => {
    const rapptor = new Rapptor();
    rapptor.start((err) => {
      // should fail because hapi-method-loader cannot find 'methods' directory in root:
      Code.expect(err.toString()).to.include('ENOENT: no such file or directory');
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
      Code.expect(raptConfig.connection.port).to.equal(8080);
      Code.expect(raptConfig.server.debug).to.equal(false);
      Code.expect(raptConfig.testValue).to.equal('123ABC');
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
