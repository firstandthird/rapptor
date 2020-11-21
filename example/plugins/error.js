const register = function(server, options) {
  server.log(['error'], new Error('this is an error'));
};
exports.plugin = {
  register,
  once: true,
  name: 'error'
};
