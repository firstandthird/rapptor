var Rapptor = require('../');
var Boom = require('boom');

var rapptor = new Rapptor();

rapptor.server.route({
  method: 'GET',
  path: '/error',
  handler: function(request, reply) {
    reply(Boom.badImplementation('error'));
  }
});

rapptor.start();

