exports.lab = require('lab-bdd')(require('lab'));

var Rapptor = require('../');

describe('Rapptor#initialization', function() {
  it('initializes a new instance or rapptor', function(done) {
    var rapptor = new Rapptor();
    expect(rapptor).to.be.a('object');
    done();
  });
});