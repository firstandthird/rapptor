'use strict';

const Handlebars = require('handlebars');

module.exports = function(text, options) {
  text = text.string || text;

  let newText = Handlebars.Utils.escapeExpression(text);

  return new Handlebars.SafeString(newText);
};
