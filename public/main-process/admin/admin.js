const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');
const csvImporter = require('../services/fileApi/csv');

const adminGetFilePath = require('./admin-getFilePath');

/**
 * @module Nodes
 */
module.exports = class Admin {
  constructor() {
    ipcMain.handle('file-open', this.getFilePath.bind(this));
    ipcMain.handle('file-preview', this.getFilePreview.bind(this));

    this.bulkImportActiveInstance = null;

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
      if (!filePaths || filePaths.canceled) {
        return;
      }

      this.bulkImportActiveInstance = new csvImporter();
      return await this.bulkImportActiveInstance.setFilePath(filePaths.filePaths[0])
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
      const preview = await this.bulkImportActiveInstance.preview()
      return preview;
    } catch (e) {
      return e;
    }
  }
}