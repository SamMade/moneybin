const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

module.exports = async function transactionsGetMany(request) {
  logger.debug('Get Transactions');

  return await storage.transactionsGetMany(request);
}