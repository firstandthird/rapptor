exports.example = {
  method: 'GET',
  path: '/example', 
  handler: function(request, reply) {
    reply('this is an example');
  }
};