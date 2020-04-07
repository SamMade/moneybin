const storage = require('../services/storage/storage');
const logger = require('../../../shared/services/logger/logger');

module.exports = async function transactionsAdd(request) {
  logger.debug('Event - Transaction to add: ', request);
  const { uid, ...transaction } = request;

  if (!transaction.to) {
    throw new Error('Missing required field (to)');
  }

  if (!transaction.from) {
    throw new Error('Missing required field (from)');
  }

  if (!transaction.amount) {
    throw new Error('Missing required field (amount)');
  }

  if (!transaction.date) {
    throw new Error('Missing required field (date)');
  }

  const id = await storage.transactionsAdd(transaction.name, transaction.type);
  logger.debug(`Event - Transaction added with id: ${id}`);
  
  const newTransaction = {
    ...transaction,
    id,
  };

  return newTransaction;
}