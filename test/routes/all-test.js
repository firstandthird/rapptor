'use strict';
exports.allTest = {
  method: 'GET',
  path: '/all-test',
  handler: (request, reply) => {
    reply.view('all-test/index');
  }
};
