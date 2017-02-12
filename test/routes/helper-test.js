'use strict';
exports.allTest = {
  method: 'GET',
  path: '/helper-test',
  handler: (request, reply) => {
    reply.view('helper-test/index', { names: ['bob', 'dave', 'ralph'] });
  }
};
