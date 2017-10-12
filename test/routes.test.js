'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#routes', () => {
  const rapptor = new Rapptor({
    cwd: __dirname
  });

  lab.before((done) => {
    rapptor.start((err, server) => {
      Code.expect(err).to.equal(undefined);
      done();
    });
  });

  lab.test('should automatically load routes from the appropriate folder', (done) => {
    const server = rapptor.server;
    server.inject({
      method: 'GET',
      url: '/example'
    }, (response) => {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.equal('this is an example');
      done();
    });
  });

  lab.test('should automatically load routes from the appropriate folder', (done) => {
    const server = rapptor.server;
    server.inject({
      method: 'GET',
      url: '/example'
    }, (response) => {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.equal('this is an example');
      done();
    });
  });

  lab.after((done) => {
    rapptor.stop(() => {
      done();
    });
  });
});

lab.experiment('Rapptor#routes log requests', () => {
  let rapptor;
  lab.test('should log request with hapi-logr if ENV.ACCESS_LOGS is true', (done) => {
    process.env.ACCESS_LOGS = 'true';
    rapptor = new Rapptor({
      cwd: __dirname
    });
    rapptor.start((err, server) => {
      if (err) {
        throw err;
      }
      const oldLog = console.log;
      console.log = (msg) => {
        oldLog(msg);
        Code.expect(msg).to.contain('request');
        Code.expect(msg).to.contain('/example');
        console.log = oldLog;
        rapptor.stop(() => {
          done();
        });
      };
      server.inject({
        method: 'GET',
        url: '/example'
      }, (response) => {
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.equal('this is an example');
      });
    });
  });

  lab.test('does not log request if ENV.ACCESS_LOGS is not true', (done) => {
    process.env.ACCESS_LOGS = undefined;
    rapptor = new Rapptor({
      cwd: __dirname
    });
    rapptor.start((err, server) => {
      if (err) {
        throw err;
      }
      const shouldBeEmpty = [];
      const oldLog = console.log;
      console.log = (msg) => {
        shouldBeEmpty.push(msg);
      };
      server.inject({
        method: 'GET',
        url: '/example'
      }, (response) => {
        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.equal('this is an example');
        Code.expect(shouldBeEmpty.length).to.equal(0);
        rapptor.stop(() => {
          done();
        });
      });
    });
  });
});
