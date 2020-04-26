const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');
const filterApi = require('../services/api/parseFilters/parseFilters');

/**
 * @typedef getManyRequest
 * @type {object} 
 * @property {number} max
 * @property {number} offset
 * @property {string} filter
 */

/**
 * @param {getManyRequest} request 
 */
module.exports = async function transactionsGetMany(request) {
  logger.debug('Get Transactions');

  return await storage.transactionsGetMany({
    ...request,
    ...(request && request.filter && {filter: filterApi(request.filter)}),
  });
}