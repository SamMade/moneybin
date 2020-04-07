const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const logger = require('../../../../../shared/services/logger/logger');

const dbPath = path.resolve(global.__basedir, './moneybin.db');

const init = require('./methods/init');
const close = require('./methods/close');
const nodesAdd = require('./methods/nodes-add');
const nodesRemove = require('./methods/nodes-remove');
const nodesGetAll = require('./methods/nodes-getAll');
const transactionsAdd = require('./methods/transactions-add');
const transactionsRemove = require('./methods/transactions-remove');
const transactionsGetAll = require('./methods/transactions-getAll');

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
    this.nodesGetAll = (...args) => nodesGetAll(this.db, ...args);
    this.transactionsAdd = (...args) => transactionsAdd(this.db, ...args);
    this.transactionsRemove = (...args) => transactionsRemove(this.db, ...args);
    this.transactionsGetAll = (...args) => transactionsGetAll(this.db, ...args);
    this.close = (...args) => close(this.db, ...args);
  }

}


    
// this.run = promisify(this.db.run).bind(this.db);
// this.all = promisify(this.db.all).bind(this.db);
// this.get = promisify(this.db.get).bind(this.db);
// this.each = promisify(this.db.each).bind(this.db);
// this.exec = promisify(this.db.exec).bind(this.db);
// this.close = this.db.close.bind(this.db); // sync