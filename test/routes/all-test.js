'use strict';
exports.allTest = {
  method: 'GET',
  path: '/all-test',
  handler: (request, h) => h.view('all-test/index')
};
