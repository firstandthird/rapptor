'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#initialization', () => {
  lab.test('initializes a new instance or rapptor', (done) => {
    const rapptor = new Rapptor();
    Code.expect(typeof rapptor).to.equal('object');
    done();
  });
});
