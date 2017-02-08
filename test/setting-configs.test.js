// 'use strict';
// const Rapptor = require('../');
// const Code = require('code');   // assertion library
// const Lab = require('lab');
// const lab = exports.lab = Lab.script();
// const loadConfig = require('confi');
//
// lab.experiment('Rapptor#setup', () => {
//   lab.test('should have a base set of configurations', (done) => {
//     const rapptor = new Rapptor();
//     const config = loadConfig('../conf');
//     loadConfig.reset();
//     console.log(config)
//     console.log(config.connection)
//     console.log(rapptor)
//     Code.expect(config.connection.port).to.equal(rapptor.config.connection.port);
//     Code.expect(config.connection.address).to.equal(rapptor.config.connection.address);
//     Code.expect(config.assets).to.equal(rapptor.config.assets);
//     Code.expect(config.mongo.host).to.equal(rapptor.config.mongo.host);
//     Code.expect(config.mongo.db).to.equal(rapptor.config.mongo.db);
//     Code.expect(config.mongo.port).to.equal(rapptor.config.mongo.port);
//     done();
//   });
//
//   lab.test('should accept an object for configurations', (done) => {
//     const rapptor = new Rapptor({
//       cwd: __dirname
//     });
//     const raptConfig = rapptor.config;
//     Code.expect(raptConfig.assets.host).to.equal('http://localhost:7321');
//     Code.expect(raptConfig.connection.port).to.equal(7321);
//     Code.expect(raptConfig.testValue).to.equal('123ABC');
//     done();
//   });
// });
