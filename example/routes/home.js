exports.home = {
  method: 'GET',
  path: '/', 
  handler: function(request, reply) {

    request.server.plugins.metrics.add('testing', { isTest: true }, function(err, metric) {
      reply.view('test/view');
    });
  }
};