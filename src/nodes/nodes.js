const dataStore = require('../dataStore');

module.exports = {
  addNode: function({name, type}) {
    return dataStore.addNode(name, type);
  },
  removeNode: function({id}) {
    return dataStore.removeNode(id);
  },
  getAllNodes: function() {
    return dataStore.getNodes();
  },
}