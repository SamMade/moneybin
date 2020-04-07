const { promisify } = require('util');

module.exports = function(db) {
  return promisify(db.all.bind(db))('SELECT * FROM Nodes');
}