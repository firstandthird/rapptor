'use strict';
module.exports = {
  method() {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    wait(500);
    return Math.random();
  }
};
