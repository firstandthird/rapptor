var Handlebars = require('handlebars');
module.exports = function(text) {
  text = text.string || text;

  var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + ' <br>' + '$2');
  return new Handlebars.SafeString(nl2br);
};
