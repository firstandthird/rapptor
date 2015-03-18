exports.lab = require('lab-bdd')(require('lab'));
var path = require('path');
var cwd = process.cwd();
var loadConfig = require('confi');
var Rapptor = require('../');

describe('Rapptor#routes', function() {
  it('should automatically load routes from the appropriate folder', function(done) {
    var rapptor = new Rapptor({
      cwd: __dirname
    });
    
    rapptor.start(function(srvr){
      srvr.inject({
        method: 'GET',
        url: "/example"
      }, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal('this is an example');
        done();
      });
    });
    
  });
});
