var Handlebars = require('handlebars');
var url = require('url');

module.exports = function (type, filename) {
  if (!filename) {
    return;
  }

  var cdn = this.config.assets.host || '';
  var file = this.server.methods.getAsset(filename, type);
  var filePath = url.resolve(cdn, this.config.assets.path) + '/' + file;

  var out = '';
  if (type == 'css') {
    out = '<link rel="stylesheet" href="'+filePath+'"/>';
  } else if (type == 'js') {
    out = '<script src="'+filePath+'"></script>';
  }
  return new Handlebars.SafeString(out);
};
