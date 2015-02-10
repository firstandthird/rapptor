module.exports = {
  method: function(next) {
    return next(null, new Date());
  },
  options: {
    cache: {
      expiresIn: 60 * 60 * 1000
    },
    generateKey: function() {
      return 'getTimeExample';
    }
  }
};