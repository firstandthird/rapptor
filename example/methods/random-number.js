'use strict';
module.exports = {
  method: (done) => {
    setTimeout(() => {
      done(null, Math.random());
    }, 500);
  }
};
