'use strict';
module.exports = function list(items) {
  return `<names>${items.data.root.names.join(':')} </names>`;
};
