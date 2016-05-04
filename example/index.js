'use strict';

const Rapptor = require('../');
const Boom = require('boom');

const rapptor = new Rapptor({
  cwd: __dirname
});

rapptor.server.route({
  method: 'GET',
  path: '/error',
  handler: function(request, reply) {
    reply(Boom.badImplementation('error'));
  }
});

rapptor.start();
