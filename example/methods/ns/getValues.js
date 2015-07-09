module.exports = {
  method: function(x, y, z, next) {
    
    var oneVal = x + " kings of spain";
    var twoVal = y + " kings of greece";
    var threeVal = z + " kings of all";

    ret = {
      one: oneVal,
      two: twoVal,
      three: threeVal
    };

    return next(null, ret);
  }
}
