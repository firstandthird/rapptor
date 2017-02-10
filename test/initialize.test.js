'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#initialization', { timeout: 5000 }, () => {
  lab.test('initializes a new instance of rapptor', (done) => {
    const rapptor = new Rapptor({
      cwd: __dirname,
    });
    Code.expect(typeof rapptor).to.equal('object');
    rapptor.start((err, server, config) => {
      Code.expect(err).to.equal(undefined);
      Code.expect(typeof server).to.equal('object');
      Code.expect(typeof server.methods.randomNumber).to.equal('function');
      rapptor.stop(done);
    });
  });
});
