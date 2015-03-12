var url = require('url');
var Handlebars = require('handlebars');

module.exports = function (type, filename) {
  if (!filename) {
    return;
  }

  var cdn = this.app.config.assets.host || '';
  var file;

  if (type == 'image' || type == 'image-path') {
    file = filename;
  } else {
    file = this.methods.getAsset(filename, type);
  }
  
  var filePath = url.resolve(cdn, this.app.config.assets.path) + '/' + file;

  var out = '';
  if (type == 'css') {
    out = '<link rel="stylesheet" href="'+filePath+'"/>';
  } else if (type == 'js') {
    out = '<script src="'+filePath+'"></script>';
  } else if (type == 'image') {
    out = '<img src="'+filePath+'"/>';
  } else if (type == 'image-path') {
    out = filePath;
  }
  return new Handlebars.SafeString(out);
};
