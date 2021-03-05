const { ipcMain } = require('electron');
const logger = require('../services/logger/logger');

const nodesGet = require('./nodes-get');
const nodesGetMany = require('./nodes-getMany');
const nodesPost = require('./nodes-post');
const nodesRemove = require('./nodes-remove');
const nodesNameAutocomplete = require('./nodes-getName-autocomplete');
const nodesGetMatch = require('./nodes-getMatch');

const loggerContext = { service: 'Nodes' };

/**
 * @module Nodes
 */
module.exports = class Nodes {
  constructor() {
    ipcMain.handle('nodes-get', this.getNode.bind(this));
    ipcMain.handle('nodes-getMany', this.getManyNodes.bind(this));
    ipcMain.handle('nodes-post', this.postNode.bind(this));
    ipcMain.handle('nodes-remove', this.removeNode.bind(this));
    ipcMain.handle('nodes-getName-autocomplete', this.getNameAutocomplete.bind(this));
    ipcMain.handle('nodes-getMatch', this.getMatch.bind(this));

    logger.debug('Nodes init ready', loggerContext);
  }

  async init() {
    logger.info('Nodes init complete', loggerContext);
    return;
  }

  /**
   * Add / Update Node
   * @param {*} event 
   * @param {import('./nodes-post').nodesAddRequest} request 
   * @returns {string} id of the node
   */
  async postNode(event, request) {
    try {
      const newNode = await nodesPost(request);
      event.sender.send('server-event', 'node-added');
      return newNode.id;
    } catch (e) {
      logger.error(e, loggerContext);
      return e;
    }
  }

  async removeNode(event, request) {
    const nodeId = await nodesRemove(request);
    event.sender.send('server-event', 'node-removed');
    return nodeId;
  }

  async getNode(event, request) {
    try {
      const node = await nodesGet(request);
      return node;
    } catch (e) {
      logger.error(e, loggerContext);
      throw e;
    }
  }

  /**
   * Get multiple Nodes
   * @param {*} event 
   * @param {import('./nodes-getMany').getManyRequest} request 
   */
  async getManyNodes(event, request) {
    return nodesGetMany(request);
  }

  async getNameAutocomplete(event, request) {
    return nodesNameAutocomplete(request);
  }

  /**
   * Find potential matches
   * @param {*} event 
   * @param {*} request 
   * @return {import('./nodes-getMatch').Matches[]}
   */
  async getMatch(event, request) {
    return nodesGetMatch(request);
  }
}