'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#initialization', () => {
  lab.test('initializes a new instance of rapptor', (done) => {
    const rapptor = new Rapptor({
      CWD: __dirname
    });
    Code.expect(typeof rapptor).to.equal('object');
    console.log(Object.keys(rapptor));
    console.log(rapptor.options);
    rapptor.start((err, server, config) => {
      Code.expect(err).to.equal(null);
      Code.expect(typeof server).to.equal('object');
    });
    done();
  });
});
