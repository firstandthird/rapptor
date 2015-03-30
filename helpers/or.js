module.exports = function (val1, val2, options) {
  if (val1 || val2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
