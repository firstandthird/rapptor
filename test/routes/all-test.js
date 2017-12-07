'use strict';
exports.allTest = {
  method: 'GET',
  path: '/all-test',
  handler: (request, h) => {
    return h.view('all-test/index');
  }
};
