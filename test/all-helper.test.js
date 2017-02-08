// 'use strict';
// const Rapptor = require('../');
// const Code = require('code');   // assertion library
// const Lab = require('lab');
// const lab = exports.lab = Lab.script();
//
// lab.experiment('Rapptor#all', function() {
//   let server;
//   const rapptor = new Rapptor({
//     cwd: __dirname
//   });
//
//   lab.before((done) => {
//     rapptor.start((err, returnedServer) => {
//       console.log('server!!')
//       console.log('server!!')
//       console.log('server!!')
//       console.log(err)
//       server = returnedServer;
//       done();
//     });
//   });
//
//   lab.test('should use the all helper correctly', (done) => {
//     const server = rapptor.server;
//     server.inject({
//       method: 'GET',
//       url: "/all-test"
//     }, function(response) {
//       expect(response.statusCode).to.equal(200);
//       //console.log(response.result);
//       const docBody = response.result;
//       docBody = docBody.replace(/\n|\s{2,}/g, "");
//       expect(docBody).to.equal("<h1>Hi!</h1><p>true</p>");
//       rapptor.stop(done);
//     });
//   });
// });
