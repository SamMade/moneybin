const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const logger = require('./services/logger/logger');

const dbPath = path.resolve(global.__basedir, './moneybin.db');

const init = require('./methods/init');
const close = require('./methods/close');
const nodesAdd = require('./methods/nodes-add');
const nodesRemove = require('./methods/nodes-remove');
const nodesGet = require('./methods/nodes-get');
const nodesGetMany = require('./methods/nodes-getMany');
const nodesGetNameAutocomplete = require('./methods/nodes-getName-autocomplete');
const transactionsAdd = require('./methods/transactions-add');
const transactionsRemove = require('./methods/transactions-remove');
const transactionsGet = require('./methods/transactions-get');
const transactionsGetMany = require('./methods/transactions-getMany');

module.exports = class SqlStorage {
  constructor(){
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        return logger.error(err.message);
      }
      logger.info('Connected to the moneybin database.');
    });

    this.init = (...args) => init(this.db, ...args);
    this.nodesAdd = (...args) => nodesAdd(this.db, ...args);
    this.nodesRemove = (...args) => nodesRemove(this.db, ...args);
    this.nodesGet = (...args) => nodesGet(this.db, ...args);
    this.nodesGetMany = (...args) => nodesGetMany(this.db, ...args);
    this.nodesGetNameAutocomplete = (...args) => nodesGetNameAutocomplete(this.db, ...args);
    this.transactionsAdd = (...args) => transactionsAdd(this.db, ...args);
    this.transactionsRemove = (...args) => transactionsRemove(this.db, ...args);
    this.transactionsGet = (...args) => transactionsGet(this.db, ...args);
    this.transactionsGetMany = (...args) => transactionsGetMany(this.db, ...args);
    this.close = (...args) => close(this.db, ...args);
  }
};
