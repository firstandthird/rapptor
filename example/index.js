var Rapptor = require('../');

var rapptor = new Rapptor();

rapptor.server.method('getTime', function(next) {
  return next(null, new Date());
}, {
  cache: {
    expiresIn: 60 * 60 * 1000
  },
  generateKey: function() {
    return 'getTimeExample';
  }
});

rapptor.server.route({
  method: 'GET',
  path: '/', 
  handler: function(request, reply) {
    reply('yep');
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

rapptor.start();

