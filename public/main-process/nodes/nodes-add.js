const dataStore = require('../../dataStore');

module.exports = function nodesAdd({ name, type }) {
  // add to db
  return dataStore.addNode(name, type);
}