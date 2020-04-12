const { promisify } = require('util');

module.exports = async function(db, id) {
  const transaction = await promisify(db.get.bind(db))(
    'SELECT * FROM Transactions WHERE id = ?',
    id,
  );

  if (!transaction) { return null; }

  return {
    to: transaction.target,
    from: transaction.source,
    amount: transaction.amount,
    date: transaction.postDate,
    notes: transaction.notes,
  };
}