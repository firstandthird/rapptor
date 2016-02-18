'use strict';
exports.home = {
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
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
