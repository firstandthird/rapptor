exports.allTest = {
  method: 'GET',
  path: '/all-test', 
  handler: function(request, reply) {
    reply.view('all-test/index');
  }
};