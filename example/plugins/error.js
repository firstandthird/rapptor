'use strict';
exports.register = function(server, options, next) {
  server.log(['error'], new Error('this is an error'));
  next();
};
exports.register.attributes = {
  name: 'error'
};
