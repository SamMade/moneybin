const { promisify } = require('util');
const has = require('lodash/has');
const logger = require('../services/logger/logger');

module.exports = async function SqlTransactionsGetMany(db, request) {
  let parameters = [];
  let query = 'SELECT * FROM Transactions';

  if (has(request, 'max')) {
    query += ' LIMIT ?';
    parameters.push(request.max);
  }

  if (has(request, 'offset')) {
    query += ' OFFSET ?';
    parameters.push(request.offset);
  }

  logger.debug(`SQL query: ${query}`);

  const result = await promisify(db.all.bind(db))(query, parameters);

  if (!result) {
    return [];
  }

  return result.map((transaction) => ({
    from: transaction.source,
    to: transaction.target,
    amount: transaction.amount,
    date: transaction.postDate,
    notes: transaction.notes,
  }));
}