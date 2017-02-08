'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#initialization', () => {
  lab.test('initializes a new instance of rapptor', (done) => {
    const rapptor = new Rapptor();
    Code.expect(typeof rapptor).to.equal('object');
    console.log(Object.keys(rapptor))
    console.log(rapptor.options)
    Code.expect(typeof rapptor.server).to.equal('object');
    done();
  });
});
