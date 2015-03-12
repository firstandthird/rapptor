exports.time = {
  method: 'GET',
  path: '/time', 
  handler: function(request, reply) {
    request.server.methods.getTime(function(err, result){
      reply(result);
    });
  }
};