'use strict';

const Storage = require('./main-process/services/storage/storage');
const storage = new Storage();

module.exports = {
  init: async function setup() {
    await storage.init();

    console.log('Storage init ...complete');
  },
  close: storage.close,
  getTransactions: function() {
    return storage.all('SELECT * FROM Transactions');
  },
  addTransaction: async function(date, from, to, amount) {
    await storage.run(
      'INSERT INTO Transactions(postDate, source, target, amount) VALUES(DATE(?), ?, ?, ?)',
      [date, from, to, amount]
    )
    return await storage.get(
      'SELECT last_insert_rowid()'
    );
  },
  removeTransaction: function(id) {
    return storage.run(
      'DELETE FROM Transactions WHERE id=?',
      id
    )
  },
  getNodes: function() {
    return storage.all('SELECT * FROM Nodes');
  },
  addNode: async function(name, type) {
    await storage.run(
      'INSERT INTO Nodes(name, type) VALUES(?, ?)',
      [name, type]
    )
    const {"last_insert_rowid()":id} = await storage.get(
      'SELECT last_insert_rowid()'
    );

    return id;
  },
  removeNode: function(id) {
    return storage.run(
      'DELETE FROM Nodes WHERE id=?',
      id
    )
  },
};
