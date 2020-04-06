const dataStore = require('../../dataStore');

module.exports = function nodesRemove({ name, type }) {
  // add to db
  return dataStore.removeNode(name, type);
}