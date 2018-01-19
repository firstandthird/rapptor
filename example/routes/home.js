'use strict';
exports.home = {
  method: 'GET',
  path: '/',
  handler(request, reply) {
    const server = request.server;
    server.methods.randomNumber((err, number) => {
      if (err) {
        return reply(err);
      }

      reply({
        config: server.settings.app.someConfigValue,
        randomNumber: number
      });
    });
  }
};

exports.error = {
  method: 'GET',
  path: '/bug',
  handler(request, reply) {
    const a = request.dummy.blah; //this will error
    reply(a);
  }
};
