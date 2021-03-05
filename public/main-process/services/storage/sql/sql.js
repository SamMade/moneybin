const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const init = require('./methods/init');
const close = require('./methods/close');
const nodesPost = require('./methods/nodes-post');
const nodesRemove = require('./methods/nodes-remove');
const nodesGet = require('./methods/nodes-get');
const nodesGetMany = require('./methods/nodes-getMany');
const nodesMatch = require('./methods/nodes-match');
const nodesGetNameAutocomplete = require('./methods/nodes-getName-autocomplete');
const transactionsAdd = require('./methods/transactions-add');
const transactionsRemove = require('./methods/transactions-remove');
const transactionsGet = require('./methods/transactions-get');
const transactionsGetMany = require('./methods/transactions-getMany');

const dbPath = path.resolve(global.__basedir, './moneybin.db');
const loggerContext = { service: 'Storage/sqlite' };

class SqlStorage {
  constructor(logger) {
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        return logger.error(err.message, loggerContext);
      }
      logger.info('Connected to the moneybin database.', loggerContext);
    });

    this.transactionsAdd = (...args) => transactionsAdd(this.db, ...args);
    this.transactionsRemove = (...args) => transactionsRemove(this.db, ...args);
    this.transactionsGet = (...args) => transactionsGet(this.db, ...args);
    this.transactionsGetMany = (...args) => transactionsGetMany(this.db, ...args);
    this.close = (...args) => close(this.db, ...args);
  }
  
  init({ ...params }) { return init({logger: console, ...params, db: this.db }); }

  /**
   * @param {object} params
   * @param {import('../storage').NodeAdd[]} params.nodes 
   */
  nodesPost({ ...params }) { return nodesPost({ logger: console, ...params, db: this.db }); }

  /**
   * @param {import('../storage').NodeGet} params
   */
  nodesGet({ ...params }) { return nodesGet({ logger: console, ...params, db: this.db }); }

  /**
   * @param {import('../storage').NodeGetMany} params
   */
  nodesGetMany({ ...params }) { return nodesGetMany({ logger: console, ...params, db: this.db }); }

  /**
   * @param {object} params
   * @param {string} params.id 
   */
  nodesRemove({ ...params }) { return nodesRemove({ logger: console, ...params, db: this.db }); }
  
  /**
   * @param {object} params
   * @param {string} params.searchTerm 
   */
  nodesMatch({ ...params }) { return nodesMatch({ logger: console, ...params, db: this.db }); }

  /**
   * @param {object} params
   * @param {string} params.searchTerm 
   */
  nodesGetNameAutocomplete({ ...params }) { return nodesGetNameAutocomplete({ logger: console, ...params, db: this.db }); }
  
};
module.exports = SqlStorage;
