'use strict';
const Rapptor = require('../');
const tap = require('tap');


tap.test('should use custom helper correctly', async t => {
  const rapptor = new Rapptor({
    configPath: `${__dirname}/conf2`,
    cwd: __dirname
  });
  await rapptor.start();
  const response = await rapptor.server.inject({
    method: 'GET',
    url: '/helper-test'
  });
  t.equal(response.statusCode, 200, 'custom helper does not crash');
  t.match(response.result, 'bob:dave:ralph', 'custom helper returns correct template');
  await rapptor.stop();
});

tap.test('should use the all helper correctly', async t => {
  const rapptor = new Rapptor({
    configPath: `${__dirname}/conf2`,
    cwd: __dirname
  });
  await rapptor.start();
  const response = await rapptor.server.inject({
    method: 'GET',
    url: '/all-test'
  });
  t.equal(response.statusCode, 200, 'all helper does not crash');
  t.match(response.result, '<p>true</p>', 'all helper returns correct template');
  await rapptor.stop();
});
