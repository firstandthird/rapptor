var fs = require('fs');
var path = require('path');
var assets = {};

module.exports = {
  method: function(basename, type) {
    if (this.app.config.assets.mapping) {
      var assetPath = path.join(this.app.config.cwd, this.app.config.structure.assets, this.app.config.assets.mapping);
      if (fs.existsSync(assetPath)) {
        assets = require(assetPath);
      }
    }

    var filename = basename + '.' + type;

    var assetFile = assets[filename] || filename;
    return path.join(this.app.config.assets.compiled, assetFile);
  }
};
