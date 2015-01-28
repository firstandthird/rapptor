var Rapptor = require('../');

var rapptor = new Rapptor();

rapptor.server.route({
  method: 'GET',
  path: '/', 
  handler: function(request, reply) {
    reply('yep');
  }
});
rapptor.start();

