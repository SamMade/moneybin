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
 * @param {transactionsAddRequest[]} request
 */
module.exports = async function transactionsAdd(request) {
  logger.debug('Event - Transaction to add: ', request);
  
  const input = !Array.isArray(request) ? [request] : request;
  
  const mappedRequests = input.map((singleRequest) => {
    
    const { uid, ...transaction } = singleRequest;

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

    return tranformRequests(transaction);
  });

  const ids = await storage.transactionsAdd(mappedRequests);

  logger.debug(`Event - Transaction added with id: ${ids.join(", ")}`);
  
  return input.map((transaction, transactionIndex) => ({ ...transaction, id: ids[transactionIndex] }));
}

/**
 * Takes api parameters and transforms them to storage parameters
 */
function tranformRequests(transaction) {
  return {
    id: transaction.id || undefined,
    to: transaction.to,
    from: transaction.from,
    amount: transaction.amount,
    postDate: moment(transaction.postDate).valueOf(),
    notes: transaction.notes,
  };
}