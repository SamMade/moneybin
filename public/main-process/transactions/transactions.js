const dataStore = require('../dataStore');

module.exports = {
  addTransaction: function({date, to, from, amount}) {
    return dataStore.addTransaction(date, from, to, amount);
  },
  removeTransaction: function({id}) {
    return dataStore.removeTransaction(id);
  },
  getAllTransactions: function() {
    return dataStore.getTransactions();
  },
}