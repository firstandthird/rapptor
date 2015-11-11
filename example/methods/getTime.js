'use strict';

module.exports = {
  method: (next) => next(null, new Date()),
  options: {
    cache: {
      expiresIn: 60 * 60 * 1000,
      generateTimeout: 400
    },
    generateKey: () => 'getTimeExample'
  }
};
