const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

module.exports = async function nodesGet(id) {
  logger.debug('Get Transaction');
  return await storage.transactionsGet(id);
}