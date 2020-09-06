const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

module.exports = async function nodesGet(request) {
  logger.debug('Get Node');

  if (!request.id) {
    throw new Error('Missing required field (id)');
  }

  return storage.nodesGet(request);
}