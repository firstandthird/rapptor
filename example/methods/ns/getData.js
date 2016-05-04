'use strict';

module.exports = {
  method: function(x, y, z, next) {
    if(x === 0 || y === 0) {
      return next('Lengths can\'t be 0');
    }

    let cbe = (x * x) + (y * y);
    let xbe = (z * z);

    let ret = {
      cbe: cbe,
      xbe: xbe,
      triple: (cbe == xbe)
    };

    return next(null, ret);
  }
}
