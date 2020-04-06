const dataStore = require('../../dataStore');

module.exports = async function nodesGetAll() {
  return await dataStore.getNodes();
}