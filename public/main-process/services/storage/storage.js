'use strict';

const { promisify } = require('util');
const sqlite3 = require('sqlite3').verbose();

/**
 * Abstract class
 */

module.exports = class Storage {
  constructor(dbPath){
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the moneybin database.');
    });

    this.run = promisify(this.db.run).bind(this.db);
    this.all = promisify(this.db.all).bind(this.db);
    this.get = promisify(this.db.get).bind(this.db);
    this.each = promisify(this.db.each).bind(this.db);
    this.exec = promisify(this.db.exec).bind(this.db);
    this.close = this.db.close.bind(this.db); // sync
  }
}