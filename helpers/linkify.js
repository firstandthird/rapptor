'use strict';

const Handlebars = require('handlebars');
const Autolinker = require('autolinker');

module.exports = function(text, options) {
  text = text.string || text;

  let linkedText = Autolinker.link(text, {
    newWindow: true,
    phone: false
  });

  return new Handlebars.SafeString(linkedText);
};
