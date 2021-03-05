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
    // import
    ipcMain.handle('transactions-import-setFile', this.setImportFilePath.bind(this));
    ipcMain.handle('transactions-import-preview', this.getImportFilePreview.bind(this));
    ipcMain.handle('transactions-import-assignColumns', this.setImportColumns.bind(this));
    ipcMain.handle('transactions-import-requestTargets', this.getImportTargets.bind(this));

    this.bulkImport = null;

    logger.debug('Service: Transactions ...ready');
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
    return transactionsGet(request);
  }

  async getManyTransactions(event, request) {
    return transactionsGetMany(request);
  }

  /**
   * Opens File Dialog to choose file
   * @returns {{canceled: boolean, filePaths: string[]}} path of the file chosen
   */
  async setImportFilePath(event, request) {
    try {
      const filePaths = await transactionsGetFilePath();
      if (!filePaths || filePaths.canceled) {
        return;
      }

      this.bulkImport = new TransactionsImport();
      return this.bulkImport.setFilePath(filePaths.filePaths[0])
    } catch (e) {
      throw e;
    }
  }

  /**
   * Opens File Dialog to choose file
   * @returns {{canceled: boolean, filePaths: string[]}} path of the file chosen
   */
  async getImportFilePreview(event, request) {
    try {
      return this.bulkImport.preview();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Assigns column mappings
   */
  async setImportColumns(event, request) {
    try {
      await this.bulkImport.setColumnMapping(request);
      return;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Gets potential matches
   * @param {*} event 
   * @param {*} request 
   */
  async getImportTargets(event, request) {
    try {
      return this.bulkImport.getTargets();
    } catch (e) {
      throw e;
    }
  }
}