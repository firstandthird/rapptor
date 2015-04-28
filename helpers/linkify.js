var Handlebars = require('handlebars');
var Autolinker = require('autolinker');

module.exports = function(text, options) {
  text = text.string || text;

  var linkedText = Autolinker.link(text, {
    newWindow: true,
    phone: false
  });

  return new Handlebars.SafeString(linkedText);
};
