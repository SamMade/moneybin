const { promisify } = require('util');
const has = require('lodash/has');

const apiFilter = require('../services/api/setFilters/setFilters');
const apiSort = require('../services/api/setSort/setSort');

const loggerContext = { service: 'Storage/sqlite/nodesGetMany' };

module.exports = async function SqlNodesGetMany({ logger, db, ...request }) {
  let parameters = [];
  let query = 'SELECT * FROM Nodes';

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

  logger.debug(`SQL query: ${query}`, loggerContext);

  const output = await promisify(db.all.bind(db))(query, parameters);

  logger.info(`Obtained ${output.length} nodes`, loggerContext);

  return output;
}