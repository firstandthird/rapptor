var Handlebars = require('handlebars');
module.exports = function(text, options) {
  text = text.string || text;

  var newText = Handlebars.Utils.escapeExpression(text);

  return new Handlebars.SafeString(newText);
};
