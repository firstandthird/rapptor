exports.home = {
  method: 'GET',
  path: '/',
  async handler(request, h) {
    const server = request.server;
    const number = await server.methods.randomNumber();
    return {
      config: server.settings.app.someConfigValue,
      randomNumber: number
    };
  }
};

exports.error = {
  method: 'GET',
  path: '/bug',
  handler(request, h) {
    const a = request.dummy.blah; //this will error
    return a;
  }
};
