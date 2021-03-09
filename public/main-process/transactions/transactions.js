const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');

const transactionsGet = require('./transactions-get');
const transactionsGetMany = require('./transactions-getMany');
const transactionsPost = require('./transactions-post');
const transactionsRemove = require('./transactions-remove');

const loggerContext = { service: 'Transactions' };

/**
 * @typedef {object} Transaction
 * @property {string} id
 * @property {string} to
 * @property {string} from
 * @property {number} amount
 * @property {number} postDate
 * @property {string} isRecurring
 * @property {string} notes
 */

/**
 * @module Transactions
 */
module.exports = class Transactions {
  constructor() {
    ipcMain.handle('transactions-getMany', this.constructor.getManyTransactions);
    ipcMain.handle('transactions-get', this.constructor.getTransaction);
    ipcMain.handle('transactions-post', this.constructor.postTransaction);
    ipcMain.handle('transactions-remove', this.constructor.removeTransaction);

    logger.debug('Transactions init ready', loggerContext);
  }

  async init() {
    logger.info('Transactions init complete', loggerContext);
    return;
  }

  /**
   * @param {import('./transactions-post').transactionsPostRequest[]} request 
   */
  static async postTransaction(event, request) {
    try {
      const newTransaction = await transactionsPost(request);

      if (event) {
        event.sender.send('server-event', 'transaction-added');
      }

      return newTransaction.id;
    } catch (e) {
      logger.error(e, loggerContext);
      return e;
    }
  }

  static async removeTransaction(event, request) {
    const transactionId = await transactionsRemove(request);
    event.sender.send('server-event', 'transaction-removed');
    return transactionId;
  }

  static async getTransaction(event, request) {
    return transactionsGet(request);
  }

  static async getManyTransactions(event, request) {
    return transactionsGetMany(request);
  }
};
