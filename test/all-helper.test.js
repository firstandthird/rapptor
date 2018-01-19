'use strict';
const Rapptor = require('../');
const Code = require('code'); // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#all', () => {
  const rapptor = new Rapptor({
    configPath: `${__dirname}/conf2`,
    cwd: __dirname
  });

  lab.before(async() => {
    await rapptor.start();
  });

  lab.after(async() => {
    await rapptor.stop();
  });

  lab.test('should use custom helper correctly', async() => {
    const response = await rapptor.server.inject({
      method: 'GET',
      url: '/helper-test'
    });
    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.include('bob:dave:ralph');
  });

  lab.test('should use the all helper correctly', async() => {
    const response = await rapptor.server.inject({
      method: 'GET',
      url: '/all-test'
    });
    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.include('<p>true</p>');
  });
});
