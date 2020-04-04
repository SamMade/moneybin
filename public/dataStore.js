'use strict';

const path = require('path');
const Schema = require('./services/storage/sql/init');
const Storage = require('./services/storage/storage');

global.__basedir = path.resolve(__dirname, '..');
const dbPath = path.resolve(global.__basedir, './moneybin.db');
const storage = new Storage(dbPath);

module.exports = {
  init: async function setup() {
    console.log('db setup');
  
    const createTables = Schema.create.map((query) => storage.run(query).then(() => { console.log(`Query ran: ${query}`) }));
    return await Promise.all(createTables);
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
    return await storage.get(
      'SELECT last_insert_rowid()'
    );
  },
  removeNode: function(id) {
    return storage.run(
      'DELETE FROM Nodes WHERE id=?',
      id
    )
  },
};
