const { promisify } = require('util');

const loggerContext = { service: 'Storage/sqlite/transactionsPost' };

/**
 * @param {object} params
 * @param {*} params.logger 
 * @param {*} params.db 
 * @param {import('../../storage').TransactionAdd[]} params.transactions 
 */
module.exports = async function({ logger, db, transactions }) {
  const allTransactions = transactions.map(async (transaction) => {
    const {postDate, from, to, amount, notes} = transaction;

    await promisify(db.run.bind(db))(
      'INSERT INTO Transactions(postDate, source, target, amount, notes) VALUES(?, ?, ?, ?, ?)',
      [postDate, from, to, amount, notes]
    );

    const { 
      'last_insert_rowid()': id,
    } = await promisify(db.get.bind(db))(
      'SELECT last_insert_rowid()'
    );

    return id;
  });

  logger.info(`Posted ${allTransactions.length} Transactions`, loggerContext);

  return Promise.all(allTransactions);
}