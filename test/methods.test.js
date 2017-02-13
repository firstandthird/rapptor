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

  lab.test('should automatically load methods from the appropriate folder', (done) => {
    const server = rapptor.server;
    Code.expect(typeof server.methods.randomNumber).to.equal('function');
    server.methods.randomNumber((err, value) => {
      console.log(err)
      Code.expect(typeof err).to.equal(null);
      Code.expect(typeof value).to.equal('number');
    });
    done();
  });

  lab.after((done) => {
    rapptor.stop(() => {
      done();
    });
  });
});
