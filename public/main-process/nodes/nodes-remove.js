const dataStore = require('../../dataStore');

module.exports = function nodesRemove(id) {
  // add to db
  return dataStore.removeNode(id);
}