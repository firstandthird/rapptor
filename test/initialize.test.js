'use strict';
const Rapptor = require('../');
const Code = require('code'); // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Rapptor#initialization', { timeout: 5000 }, () => {
  lab.test('initializes a new instance of rapptor', async() => {
    const rapptor = new Rapptor({
      cwd: __dirname,
    });
    Code.expect(typeof rapptor).to.equal('object');
    Code.expect(typeof rapptor.start).to.equal('function');
    Code.expect(typeof rapptor.setup).to.equal('function');
    const { server, config } = await rapptor.start();
    Code.expect(typeof server).to.equal('object');
    Code.expect(typeof config).to.equal('object');
    await rapptor.stop();
  });

  lab.test('server stops when SIGTERM event is emitted ', async() => {
    const rapptor = new Rapptor({
      cwd: __dirname,
    });
    await rapptor.start();
    process.emit('SIGTERM');
    // wait for server to wind down:
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  lab.test('can config a new instance of rapptor without starting the server', async() => {
    const rapptor = new Rapptor({
      cwd: __dirname,
    });
    const { server, config } = await rapptor.setup();
    Code.expect(typeof server).to.equal('object');
    Code.expect(typeof config).to.equal('object');
    // verify server isn't started yet:
    Code.expect(server.info.started).to.equal(0);
  });
});
