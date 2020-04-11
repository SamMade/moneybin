const { ipcMain } = require('electron');
const logger = require('../../../shared/services/logger/logger');

const transactionsGetAll = require('./transactions-getAll');
const transactionsAdd = require('./transactions-add');
const transactionsRemove = require('./transactions-remove');

module.exports = class Transactions {
  constructor() {
    this.transactions = [];

    ipcMain.on('transactions-getAll', this.getAllTransactions.bind(this));
    ipcMain.handle('transactions-add', this.addTransaction.bind(this));
    ipcMain.handle('transactions-remove', this.removeTransaction.bind(this));

    logger.info('Service: Transactions ...ready');
  }

  async init() {
    const allTransactions = await transactionsGetAll();
    this.transactions = allTransactions;

    logger.info('Service: Transactions init ...complete');
    return;
  }

  async addTransaction(event, request) {
    try {
      const newTransaction = await transactionsAdd(request);

      this.transactions.push(newTransaction);
  
      event.sender.send('transactions-getAll-reply', this.transactions);
      return newTransaction.id;
    } catch (e) {
      return e;
    }
  }

  async removeTransaction(event, request) {
    const isFoundIndex = this.transactions.findIndex((transaction) => transaction.id === transactionId);
    if (isFoundIndex === -1) {
      return null;
    }

    const transactionId = await transactionsRemove(request);

    const copy = Array.from(this.transactions);
    copy.splice(isFoundIndex, 1);
    this.transactions = copy;
  
    event.sender.send('transactions-getAll-reply', this.transactions);
    return transactionId;
  }

  getAllTransactions(event) {
    event.reply('transactions-getAll-reply', this.transactions);
  }
}