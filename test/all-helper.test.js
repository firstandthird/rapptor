'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#all', () => {
  const rapptor = new Rapptor({
    configPath: `${__dirname}/conf2`,
    cwd: __dirname
  });

  lab.before((done) => {
    rapptor.start((err) => {
      if (err) {
        throw err;
      }
      done();
    });
  });

  lab.after((done) => {
    rapptor.stop(done);
  });

  lab.test('should use the all helper correctly', (done) => {
    rapptor.server.inject({
      method: 'GET',
      url: '/all-test'
    }, (response) => {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.include('bob:dave:ralph');
      done();
    });
  });
});
