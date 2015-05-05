var path = require('path');

module.exports = {
  method: function(basename, type) {
    var filename = basename + '.' + type;
    var assetFile = this.app.config.assets.mappingObj[filename] || filename;
    return path.join(this.app.config.assets.compiled, assetFile);
  }
};
