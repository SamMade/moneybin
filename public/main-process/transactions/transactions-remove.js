const storage = require('../services/storage/storage');
const logger = require('../../../shared/services/logger/logger');

module.exports = async function transactionsRemove(request) {
  logger.debug('Transaction to remove: ', request);
  const { uid, transactionId } = request;

  if (!transactionId) {
    throw new Error('Missing required field (transactionId)');
  }

  // add to db
  await storage.transactionsRemove(transactionId);
  logger.debug(`Event - Transaction Removed (${transactionId})`);

  return transactionId;
}