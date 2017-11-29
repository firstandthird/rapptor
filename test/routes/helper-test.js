'use strict';
exports.allTest = {
  method: 'GET',
  path: '/helper-test',
  handler: (request, h) => {
    const result = h.view('helper-test/index', { names: ['bob', 'dave', 'ralph'] });
    console.log('==============')
    console.log('==============')
    console.log('==============')
    console.log(result)
    return 'hi there'
  }
};
