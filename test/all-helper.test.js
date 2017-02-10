'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#all', function() {
  let server;
  const rapptor = new Rapptor({
    configPath: `${__dirname}/conf`,
    cwd: __dirname
  });

  lab.before((done) => {
    rapptor.start((err, returnedServer) => {
      server = returnedServer;
      done();
    });
  });

  lab.test('should use the all helper correctly', (done) => {
    server.inject({
      method: 'GET',
      url: '/all-test'
    }, (response) => {
      Code.expect(response.statusCode).to.equal(200);
      //console.log(response.result);
      // let docBody = response.result;
      // docBody = docBody.replace(/\n|\s{2,}/g, "");
      // Code.expect(docBody).to.equal('<h1>Hi!</h1><p>true</p>');
      rapptor.stop(done);
    });
  });
});
