exports.cache = {
  path: '/cache',
  method: 'GET',
  handler: {
    outputCache: {
      fn: function(request, reply) {
        reply(new Date());
      }
    }
  }
};
