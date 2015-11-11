'use strict';

exports.time = {
  method: 'GET',
  path: '/time',
  handler: function(request, reply) {
    request.server.methods.getTime((err, result) => reply(result));
  }
};
