var Rapptor = require('../');
var Boom = require('boom');

var rapptor = new Rapptor();

rapptor.server.route({
  method: 'GET',
  path: '/', 
  handler: function(request, reply) {

    request.server.plugins.metrics.add('testing', { isTest: true }, function(err, metric) {
      reply.view('test/view');
    });
  }
});

rapptor.server.route({
  method: 'GET',
  path: '/time', 
  handler: function(request, reply) {
    request.server.methods.getTime(function(err, result){
      reply(result);
    });
  }
});

rapptor.server.route({
  method: 'GET',
  path: '/error',
  handler: function(request, reply) {
    reply(Boom.badImplementation('error'));
  }
});

rapptor.start();

