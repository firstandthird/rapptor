'use strict';

exports.cache = {
  path: '/cache',
  method: 'GET',
  handler: {
    outputCache: {
      fn: (request, reply) => reply(new Date())
    }
  }
};
