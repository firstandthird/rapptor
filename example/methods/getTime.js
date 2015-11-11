module.exports = {
  method: function(next) {
    return next(null, new Date());
  },
  options: {
    cache: {
      expiresIn: 60 * 60 * 1000,
      generateTimeout: 400
    },
    generateKey: function() {
      return 'getTimeExample';
    }
  }
};
