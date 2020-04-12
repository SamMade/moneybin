const { promisify } = require('util');
const has = require('lodash/has');
const logger = require('../services/logger/logger');

module.exports = async function SqlNodesGetMany(db, request) {
  let parameters = [];
  let query = 'SELECT * FROM Nodes';

  if (has(request, 'max')) {
    query += ' LIMIT ?';
    parameters.push(request.max);
  }

  if (has(request, 'offset')) {
    query += ' OFFSET ?';
    parameters.push(request.offset);
  }

  logger.debug(`SQL query: ${query}`);

  return await promisify(db.all.bind(db))(query, parameters);
}