const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');

const adminGetFilePath = require('./admin-getFilePath');
const {bulkImportPreview} = require('./admin-bulkImport');

/**
 * @module Nodes
 */
module.exports = class Admin {
  constructor() {
    ipcMain.handle('open-file', this.getFilePath.bind(this));
    ipcMain.handle('bulk-import', this.bulkImport.bind(this));

    logger.info('Service: Admin ...ready');
  }

  async init() {
    logger.info('Service: Admin init ...complete');
    return;
  }

  /**
   * Opens File Dialog to choose file
   * @returns {{canceled: boolean, filePaths: string[]}} path of the file chosen
   */
  async getFilePath(event, request) {
    try {
      const filePaths = await adminGetFilePath();
      return filePaths;
    } catch (e) {
      return e;
    }
  }

  /**
   * Opens File Dialog to choose file
   * @returns {{canceled: boolean, filePaths: string[]}} path of the file chosen
   */
  async bulkImport(event, request) {
    try {
      await bulkImportPreview(request);
      return true;
    } catch (e) {
      console.log(e)
      return e;
    }
  }
}