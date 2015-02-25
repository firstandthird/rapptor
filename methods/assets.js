var fs = require('fs');
var path = require('path');
var assets = {};

module.exports = function() {
  var assetPath = path.join(this.cwd, this.config.structure.assets, '_prod/assets.json');
  if (fs.existsSync(assetPath)) {
    assets = require(assetPath);
  }

  return function(basename, type) {
    var useHash = (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'stage' || process.env.NODE_ENV == 'qa');

    var filename = basename + '.' + type;

    var hashFile = assets[filename];
    if (useHash && hashFile) {
      return '_prod/' + hashFile;
    }
    return '_dist/' + filename;
  }.bind(this);
};