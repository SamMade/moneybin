const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');

const TransactionsImport = require('./transactions-import');

const transactionsGet = require('./transactions-get');
const transactionsGetMany = require('./transactions-getMany');
const transactionsAdd = require('./transactions-add');
const transactionsRemove = require('./transactions-remove');
const transactionsGetFilePath = require('./transactions-getImportFilePath');

module.exports = class Transactions {
  constructor() {
    ipcMain.handle('transactions-getMany', this.getManyTransactions.bind(this));
    ipcMain.handle('transactions-get', this.getTransaction.bind(this));
    ipcMain.handle('transactions-add', this.addTransaction.bind(this));
    ipcMain.handle('transactions-remove', this.removeTransaction.bind(this));
    ipcMain.handle('transactions-import-setFile', this.setFilePath.bind(this));
    ipcMain.handle('transactions-import-preview', this.getFilePreview.bind(this));

    this.bulkImport = null;

    logger.info('Service: Transactions ...ready');
  }

  async init() {
    logger.info('Service: Transactions init ...complete');
    return;
  }

  async addTransaction(event, request) {
    try {
      const newTransaction = await transactionsAdd(request);
      event.sender.send('server-event', 'transaction-added');
      return newTransaction.id;
    } catch (e) {
      return e;
    }
  }

  async removeTransaction(event, request) {
    const transactionId = await transactionsRemove(request);
    event.sender.send('server-event', 'transaction-removed');
    return transactionId;
  }

  async getTransaction(event, request) {
    return await transactionsGet(request);
  }

  async getManyTransactions(event, request) {
    return await transactionsGetMany(request);
  }

  /**
   * Opens File Dialog to choose file
   * @returns {{canceled: boolean, filePaths: string[]}} path of the file chosen
   */
  async setFilePath(event, request) {
    try {
      const filePaths = await transactionsGetFilePath();
      if (!filePaths || filePaths.canceled) {
        return;
      }

      this.bulkImport = new TransactionsImport();
      return await this.bulkImport.setFilePath(filePaths.filePaths[0])
    } catch (e) {
      return e;
    }
  }

  /**
   * Opens File Dialog to choose file
   * @returns {{canceled: boolean, filePaths: string[]}} path of the file chosen
   */
  async getFilePreview(event, request) {
    try {
      const preview = await this.bulkImport.preview()
      return preview;
    } catch (e) {
      return e;
    }
  }
}