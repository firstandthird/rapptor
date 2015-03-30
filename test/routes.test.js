exports.lab = require('lab-bdd')(require('lab'));
var path = require('path');
var cwd = process.cwd();
var loadConfig = require('confi');
var Rapptor = require('../');

describe('Rapptor#routes', function() {

  var rapptor = rapptor = new Rapptor({
      cwd: __dirname
    });

  before(function(done) {
    rapptor.start(function(err, server) {
      // expect(err).to.equal(null);
      done();
    });
  });

  it('should automatically load routes from the appropriate folder', function(done) {
    
    var server = rapptor.server;
    server.inject({
      method: 'GET',
      url: "/example"
    }, function(response) {
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal('this is an example');
      done();
    });
    
  });

  after(function(done) {
    rapptor.stop(function() {
      done();
    });
  });
});
