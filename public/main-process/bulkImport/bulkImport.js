const { ipcMain } = require('electron');
const isEqual = require('lodash/isEqual');
const logger = require('../services/logger/logger');

const FileImport = require('./bulkImport-fileImport');
const Nodes = require('../nodes/nodes');
const Transactions = require('../transactions/transactions');

const transactionsGetFilePath = require('./bulkImport-getImportFilePath');

const loggerContext = { service: 'BulkImport' };

/**
 * @module BulkImport
 */
module.exports = class BulkImport {
  constructor() {
    ipcMain.handle('bulk-import-destroy', this.destroyFileImport.bind(this));
    ipcMain.handle('bulk-import-setFile', this.setImportFilePath.bind(this));
    ipcMain.handle('bulk-import-setSource', this.setSourceNode.bind(this));
    ipcMain.handle('bulk-import-preview', this.getImportFilePreview.bind(this));
    ipcMain.handle('bulk-import-getColumns', this.getImportColumns.bind(this));
    ipcMain.handle('bulk-import-assignColumns', this.setColumnMapping.bind(this));
    ipcMain.handle('bulk-import-getTargets', this.getImportTargets.bind(this));
    ipcMain.handle('bulk-import-assignTargets', this.setTargetMapping.bind(this));

    this.bulkImport = null;

    logger.debug('Bulk Import init ready', loggerContext);
  }

  // Boot up process
  async init() {
    logger.info('Bulk Import init complete', loggerContext);
    return;
  }

  /**
   * Create a FileImport instance
   * @param {boolean} force true to initialize new instance
   * @private
   */
  createFileImport(force) {
    if (!this.bulkImport || force) {
      this.bulkImport = new FileImport();
    }
  }

  destroyFileImport() {
    this.bulkImport = null;
  }

  /**
   * Opens File Dialog to choose file
   * @param {string|number} request id of source node
   */
  async setSourceNode(event, request) {
    try {
      this.createFileImport();

      this.bulkImport.setSourceNode(request);
    } catch (e) {
      throw e;
    }
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

      let source;
      if (this.bulkImport) {
        source = this.bulkImport.sourceNode;
      }

      this.createFileImport(true);

      if (source) {
        await this.setSourceNode(undefined, source);
      }

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
   * Gets column mappings
   */
  async getImportColumns(event, request) {
    try {
      return this.bulkImport.columnMappings;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Assigns column mappings (Page2)
   * @property {string[]} request attribute by column index
   */
  async setColumnMapping(event, request) {
    try {
      if (isEqual(this.bulkImport.columnMappings, request)) {
        return;
      }

      await this.bulkImport.setColumnMapping(request);
      await this.bulkImport.setTransactions();
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

  /**
   * Set target to ignore, create, or node id
   * @param {Object.<string, import('./bulkImport-fileImport').Target>} request target actions
   */
  async setTargetMapping(event, request) {
    try {
      logger.debug('Import Transactions Begin', loggerContext);

      // Step 1: Create nodes
      const createNodes = await this.bulkImport.getNodesToCreate(request);
      let createNodesIds;
      if (createNodes.length) {
        createNodesIds = await Nodes.postNode(null, createNodes);
        event.sender.send('server-event', 'import-nodes-added');
      }

      const transactions = this.bulkImport.transactions.reduce((arr, transaction) => {
        const targetName = transaction.target;
        const targetAction = request[targetName].node;

        // Step 2: skip transaction
        if (
          !targetAction 
          || targetAction === 'skip'
          || !transaction.amount
        ) {
          return arr;
        }

        // Step 3 get target node
        const targetNode = (targetAction === 'create')
          ? createNodesIds[createNodes.findIndex((n) => n.name === targetName)]
          : targetAction;

        if (!targetNode) {
          logger.warn('targetNode does not exist', loggerContext);
          return arr;
        }

        // Step 4: find To
        transaction.to = (transaction.amount < 0) 
          ? targetNode
          : this.bulkImport.sourceNode;

        // Step 5: find From
        transaction.from = (transaction.amount < 0) 
          ? this.bulkImport.sourceNode
          : targetNode

        // Step 6: make amount positive
        transaction.amount = Math.abs(transaction.amount);

        arr.push(transaction);

        event.sender.send('server-event', 'import-transaction-added');

        return arr;
      }, []);

      // Step 7: Create transaction
      Transactions.postTransaction(null, transactions);

      logger.info('Import Transactions Complete', loggerContext);
    } catch (e) {
      throw e;
    }
  }
};
