exports.lab = require('lab-bdd')(require('lab'));
var path = require('path');
var cwd = process.cwd();
var loadConfig = require('confi');
var Rapptor = require('../');

describe('Rapptor#setup', function() {
  it('should have a base set of configurations', function(done) {
    var rapptor = new Rapptor();
    var config = loadConfig('../conf');
    loadConfig.reset();

    expect(config.connection.port).to.eql(rapptor.config.connection.port);
    expect(config.connection.address).to.eql(rapptor.config.connection.address);

    expect(config.assets).to.eql(rapptor.config.assets);
    expect(config.mongo.host).to.eql(rapptor.config.mongo.host);
    expect(config.mongo.db).to.eql(rapptor.config.mongo.db);
    expect(config.mongo.port).to.eql(rapptor.config.mongo.port);
    
    done();
  });

  it('should accept an object for configurations', function(done) {
    var rapptor = new Rapptor({
      cwd: __dirname
    });
    
    var raptConfig = rapptor.config;

    expect(raptConfig.assets.host).to.equal('http://localhost:7321');
    expect(raptConfig.connection.port).to.equal(7321);
    expect(raptConfig.testValue).to.equal('123ABC');

    done();
  });

});