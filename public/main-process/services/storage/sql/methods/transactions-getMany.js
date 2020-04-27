const { promisify } = require('util');
const has = require('lodash/has');
const logger = require('../services/logger/logger');
const apiFilter = require('../services/api/setFilters/setFilters');
const apiSort = require('../services/api/setSort/setSort');

module.exports = async function SqlTransactionsGetMany(db, request) {
  let parameters = [];
  let query = 'SELECT * FROM Transactions';

  if (has(request, 'filter')) {
    const filter = apiFilter(request.filter);
    query += ` WHERE ${filter[0]}`;
    parameters = parameters.concat(filter[1]);
  }

  if (has(request, 'max')) {
    query += ' LIMIT ?';
    parameters.push(request.max);
  }

  if (has(request, 'offset')) {
    query += ' OFFSET ?';
    parameters.push(request.offset);
  }

  if (has(request, 'sort')) {
    query += ` ORDER BY ${apiSort(request.sort)}`;
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