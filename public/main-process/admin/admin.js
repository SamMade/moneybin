const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');


/**
 * @module Nodes
 */
module.exports = class Admin {
  constructor() {
    logger.info('Service: Admin ...ready');
  }

  async init() {
    logger.info('Service: Admin init ...complete');
    return;
  }


}