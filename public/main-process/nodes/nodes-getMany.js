const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');
const filterApi = require('../services/api/parseFilters/parseFilters');
const sortApi = require('../services/api/parseSort/parseSort');

const loggerContext = { service: 'Nodes/nodesGetMany' };

/**
 * @typedef {object} getManyRequest
 * @property {number} [max]
 * @property {number} [offset]
 * @property {string} [filter]
 * @property {string} [sort]
 */

/**
 * @param {getManyRequest} request 
 */
module.exports = async function nodesGetMany(request) {
  logger.debug(JSON.stringify(request), loggerContext);

  return await storage.nodesGetMany({
    ...request,
    ...(request && request.filter && { filter: filterApi(request.filter) }),
    ...(request && request.sort && { sort: sortApi(request.sort) }),
  });
}