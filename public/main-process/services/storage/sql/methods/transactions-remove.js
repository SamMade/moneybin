const { promisify } = require('util');

module.exports = async function(db, id) {
  return promisify(db.run.bind(db))(
    'DELETE FROM Transactions WHERE id=?',
    id,
  );
}