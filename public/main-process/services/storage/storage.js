const DB = require('./sql/sql');

/**
 * Abstract class
 */
module.exports = class Storage {
  constructor(){
    this.db = new DB();
    this.init = this.db.init;
    this.run = this.db.run;
    this.all = this.db.all;
    this.get = this.db.get;
    this.each = this.db.each;
    this.exec = this.db.exec;
    this.close = this.db.close;
  }
}