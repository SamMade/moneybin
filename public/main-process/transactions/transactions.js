const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');

const transactionsGet = require('./transactions-get');
const transactionsGetMany = require('./transactions-getMany');
const transactionsAdd = require('./transactions-add');
const transactionsRemove = require('./transactions-remove');

module.exports = class Transactions {
  constructor() {
    ipcMain.handle('transactions-getMany', this.getManyTransactions.bind(this));
    ipcMain.handle('transactions-get', this.getTransaction.bind(this));
    ipcMain.handle('transactions-add', this.addTransaction.bind(this));
    ipcMain.handle('transactions-remove', this.removeTransaction.bind(this));

    logger.info('Service: Transactions ...ready');
  }

  async init() {
    logger.info('Service: Transactions init ...complete');
    return;
  }

  async addTransaction(event, request) {
    try {
      const newTransaction = await transactionsAdd(request);

      return newTransaction.id;
    } catch (e) {
      return e;
    }
  }

  async removeTransaction(event, request) {
    const transactionId = await transactionsRemove(request);

    return transactionId;
  }

  async getTransaction(event, request) {
    return await transactionsGet(request);
  }

  async getManyTransactions(event, request) {
    return await transactionsGetMany(request);
  }
}