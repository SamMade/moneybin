const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');

const nodesGet = require('./nodes-get');
const nodesGetMany = require('./nodes-getMany');
const nodesAdd = require('./nodes-add');
const nodesRemove = require('./nodes-remove');
const nodesNameAutocomplete = require('./nodes-getName-autocomplete');

/**
 * @module Nodes
 */
module.exports = class Nodes {
  constructor() {
    ipcMain.handle('nodes-getMany', this.getManyNodes.bind(this));
    ipcMain.handle('nodes-get', this.getNode.bind(this));
    ipcMain.handle('nodes-add', this.addNode.bind(this));
    ipcMain.handle('nodes-remove', this.removeNode.bind(this));
    ipcMain.handle('nodes-getName-autocomplete', this.getNameAutocomplete.bind(this));

    logger.info('Service: Nodes ...ready');
  }

  async init() {
    logger.info('Service: Nodes init ...complete');
    return;
  }

  async addNode(event, request) {
    try {
      const newNode = await nodesAdd(request);
      event.sender.send('server-event', 'node-added');
      return newNode.id;
    } catch (e) {
      return e;
    }
  }

  async removeNode(event, request) {
    const nodeId = await nodesRemove(request);
    event.sender.send('server-event', 'node-removed');
    return nodeId;
  }

  async getNode(event, request) {
    return await nodesGet(request);
  }

  /**
   * Get multiple Nodes
   * @param {*} event 
   * @param {import('./nodes-getMany').getManyRequest} request 
   */
  async getManyNodes(event, request) {
    return await nodesGetMany(request);
  }

  getNameAutocomplete(event, request) {
    return nodesNameAutocomplete(request);
  }
}