'use strict';

module.exports = function (val1, val2, options) {
  if (val1.indexOf(val2) !== -1) {
    return options.fn(this);
  } else{
    return options.inverse(this);
  }
};
