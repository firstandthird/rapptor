// 'use strict';
// const Rapptor = require('../');
// const Code = require('code');   // assertion library
// const Lab = require('lab');
// const lab = exports.lab = Lab.script();
//
// lab.experiment('Rapptor#routes', function() {
//   const rapptor = new Rapptor({
//       cwd: __dirname
//     });
//
//   lab.before(function(done) {
//     rapptor.start(function(err, server) {
//       // expect(err).to.equal(null);
//       done();
//     });
//   });
//
//   lab.test('should automatically load routes from the appropriate folder', function(done) {
//
//     const server = rapptor.server;
//     server.inject({
//       method: 'GET',
//       url: "/example"
//     }, function(response) {
//       expect(response.statusCode).to.equal(200);
//       expect(response.result).to.equal('this is an example');
//       done();
//     });
//
//   });
//
//   lab.after(function(done) {
//     rapptor.stop(function() {
//       done();
//     });
//   });
// });
