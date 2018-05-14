const joi = require('joi');
module.exports = {
  method() {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    wait(500);
    return Math.random();
  },
  description: 'a test method',
  schema: joi.object({
    name: joi.string()
  })
};
