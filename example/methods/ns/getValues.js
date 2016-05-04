'use strict';

module.exports = {
  method: function(x, y, z, next) {

    let oneVal = x + " kings of spain";
    let twoVal = y + " kings of greece";
    let threeVal = z + " kings of all";

    ret = {
      one: oneVal,
      two: twoVal,
      three: threeVal
    };

    return next(null, ret);
  }
}
