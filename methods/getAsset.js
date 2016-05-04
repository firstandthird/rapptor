'use strict';

const path = require('path');

module.exports = {
  method: function(basename, type) {
    const filename = basename + '.' + type;
    const assetFile = this.app.config.assets.mappingObj[filename] || filename;
    return path.join(this.app.config.assets.compiled, assetFile);
  }
};
