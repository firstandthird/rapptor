module.exports = function () {
  var passing = true;
  var options = arguments[arguments.length-1];

  for (var i = 0, c = arguments.length; i < c; i++) {
    if (!arguments[i]) {
      passing = false;
      break;
    }
  }

  if (passing) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
