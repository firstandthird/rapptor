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

  lab.after((done) => {
    rapptor.stop(() => {
      done();
    });
  });
});
