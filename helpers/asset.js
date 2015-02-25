var Handlebars = require('handlebars');
var path = require('path');

module.exports = function (type, filename) {
  if (!filename) {
    return;
  }

  var cdn = this.config.assets.host || '';
  var filePath = path.join(cdn, this.config.assets.path, this.server.methods.getAsset(filename, type));

  var out = '';
  if (type == 'css') {
    out = '<link rel="stylesheet" href="'+filePath+'"/>';
  } else if (type == 'js') {
    out = '<script src="'+filePath+'"></script>';
  }
  return new Handlebars.SafeString(out);
};
