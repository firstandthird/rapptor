'use strict';

const Handlebars = require('handlebars');
module.exports = function(input, pretty) {
  const spaces = (pretty) ? '  ' : '';

  if (input._server) {
    delete input._server;
  }

  return new Handlebars.SafeString(JSON.stringify(input, null, spaces));
};
