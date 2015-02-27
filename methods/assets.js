var fs = require('fs');
var path = require('path');
var assets = {};

module.exports = function() {
  if (this.config.assets.mapping) {
    var assetPath = path.join(this.cwd, this.config.structure.assets, this.config.assets.mapping);
    if (fs.existsSync(assetPath)) {
      assets = require(assetPath);
    }
  }

  return function(basename, type) {
    var filename = basename + '.' + type;

    var assetFile = assets[filename] || filename;
    return path.join(this.config.assets.compiled, assetFile);
  }.bind(this);
};
