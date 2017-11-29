'use strict';
const Rapptor = require('../');
const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#routes', () => {
  const rapptor = new Rapptor({
    cwd: __dirname,
    configPath: `${__dirname}/conf`
  });

  lab.before(async() => {
    const { server, config } = await rapptor.start();
    Code.expect(err).to.equal(undefined);
  });

  lab.test('should automatically load methods from the appropriate folder', async() => {
    const server = rapptor.server;
    Code.expect(typeof server.methods.randomNumber).to.equal('function');
    const value = await server.methods.randomNumber();
    Code.expect(err).to.equal(null);
    Code.expect(typeof value).to.equal('number');
  });

  lab.after(async () => {
    await rapptor.stop();
  });
});
