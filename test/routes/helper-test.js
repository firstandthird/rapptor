'use strict';
exports.allTest = {
  method: 'GET',
  path: '/helper-test',
  handler: (request, h) => {
    return h.view('helper-test/index', { names: ['bob', 'dave', 'ralph'] });
  }
};
