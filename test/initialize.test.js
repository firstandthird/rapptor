'use strict';
const Rapptor = require('../');
const tap = require('tap');

tap.test('initializes a new instance of rapptor', async t => {
  process.env.LOG_TYPE = 'wood';
  const rapptor = new Rapptor({
    cwd: __dirname,
  });
  t.equal(typeof rapptor, 'object');
  t.equal(typeof rapptor.start, 'function');
  t.equal(typeof rapptor.setup, 'function');
  const { server, config } = await rapptor.start();
  t.equal(typeof server, 'object');
  t.equal(typeof config, 'object');
  t.equal(config.envVars.logType, 'wood', 'loads env vars correctly');
  await rapptor.stop();
  t.end();
});
