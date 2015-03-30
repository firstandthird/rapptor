var Handlebars = require('handlebars');
module.exports = function(text, options) {
  text = text.string || text;

  var newText = text.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi, '<a href="$1" target="_blank">$1</a>');

  return new Handlebars.SafeString(newText);
};
