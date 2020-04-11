const { promisify } = require('util');

module.exports = function(db, match) {
  return promisify(db.all.bind(db))(
    "SELECT rowid, name FROM Nodes_index WHERE Nodes_index MATCH ? || '*' ORDER BY rank LIMIT 5",
    [match]
  );
}