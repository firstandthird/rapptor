module.exports = {
  method: function(x, y, z, next) {
    if(x === 0 || y === 0) {
      next('Lengths can\'t be 0');
    }
    var cbe = (x * x) + (y * y);
    var xbe = (z * z);

    var ret = {
      cbe: cbe,
      xbe: xbe,
      triple: (cbe == xbe)
    };
    return next(null, ret);
  }
}
