const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

const loggerContext = { service: 'Nodes/nodesGet' };

/**
 * @typedef {object} getRequest
 * @property {string} id
 * @property {string[]} [select]
 */

/**
 * @param {getRequest} request 
 */
module.exports = async function nodesGet(request) {
  logger.debug(JSON.stringify(request), loggerContext);

  if (!request.id) {
    throw new Error('Missing required field (id)');
  }

  return storage.nodesGet(request);
}