var fs = require('fs');
var path = require('path');
var assets = {};

module.exports = {
  method: function() {
    if (this.app.config.assets.mapping) {
      var assetPath = path.join(this.app.config.cwd, this.config.structure.assets, this.app.config.assets.mapping);
      if (fs.existsSync(assetPath)) {
        assets = require(assetPath);
      }
    }

    return function(basename, type) {
      var filename = basename + '.' + type;

      var assetFile = assets[filename] || filename;
      return path.join(this.app.config.assets.compiled, assetFile);
    }.bind(this);
  }
};