const moment = require('moment');
const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

/**
 * @typedef transactionsAddRequest
 * @type {object}
 * @property {string} to
 * @property {string} from
 * @property {number} amount
 * @property {number} postDate
 * @property {string} notes
 */

/**
 * @param {transactionsAddRequest} request
 */
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

  if (!transaction.postDate) {
    throw new Error('Missing required field (postDate)');
  }

  if (!moment(transaction.postDate).isValid()) {
    throw new Error('Date Invalid');
  }

  const id = await storage.transactionsAdd({
    to: transaction.to,
    from: transaction.from,
    postDate: moment(transaction.postDate).valueOf(),
    amount: transaction.amount,
    notes: transaction.notes,
  });
  logger.debug(`Event - Transaction added with id: ${id}`);
  
  const newTransaction = {
    ...transaction,
    id,
  };

  return newTransaction;
}