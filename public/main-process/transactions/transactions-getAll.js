const storage = require('../services/storage/storage');
const logger = require('../../../shared/services/logger/logger');

module.exports = async function transactionsGetAll() {
  logger.debug('Get Transactions');
  return await storage.transactionsGetAll();
}