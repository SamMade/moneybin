const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const path = require('path');

const logger = require('../../../../../shared/services/logger/logger');
const Schema = require('./model');

const dbPath = path.resolve(global.__basedir, './moneybin.db');

module.exports = class Storage {
  constructor(){
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        return logger.error(err.message);
      }
      logger.info('Connected to the moneybin database.');
    });
    
    this.run = promisify(this.db.run).bind(this.db);
    this.all = promisify(this.db.all).bind(this.db);
    this.get = promisify(this.db.get).bind(this.db);
    this.each = promisify(this.db.each).bind(this.db);
    this.exec = promisify(this.db.exec).bind(this.db);
    this.close = this.db.close.bind(this.db); // sync
  }

  async init() {
    const createTables = Schema.create.map((query) => this.run(query)
      .then(() => { logger.debug(`Query ran: ${query}`) })
    );
    return await Promise.all(createTables);
  }
}
