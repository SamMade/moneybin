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
 * @typedef {object} Node
 * @property {string | number} id
 * @property {string} name
 * @property {string} type
 * @property {string[]} alias

/**
 * @module Nodes
 */
module.exports = class Nodes {
  constructor() {
    ipcMain.handle('nodes-get', this.constructor.getNode);
    ipcMain.handle('nodes-getMany', this.constructor.getManyNodes);
    ipcMain.handle('nodes-post', this.constructor.postNode);
    ipcMain.handle('nodes-remove', this.constructor.removeNode);
    ipcMain.handle('nodes-getName-autocomplete', this.constructor.getNameAutocomplete);
    ipcMain.handle('nodes-getMatch', this.constructor.getMatch);

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
   * @returns {string[] | string} id of the node
   */
  static async postNode(event, request) {
    try {
      const newNode = await nodesPost(request);

      if (event) {
        event.sender.send('server-event', 'node-added');
      }

      return (Array.isArray(newNode)) ? newNode.map((n) => n.id) : newNode.id;
    } catch (e) {
      logger.error(e, loggerContext);
      return e;
    }
  }

  static async removeNode(event, request) {
    const nodeId = await nodesRemove(request);
    event.sender.send('server-event', 'node-removed');
    return nodeId;
  }

  static async getNode(event, request) {
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
  static async getManyNodes(event, request) {
    return nodesGetMany(request);
  }

  static async getNameAutocomplete(event, request) {
    return nodesNameAutocomplete(request);
  }

  /**
   * Find potential matches
   * @param {*} event 
   * @param {*} request 
   * @return {import('./nodes-getMatch').Matches[]}
   */
  static async getMatch(event, request) {
    return nodesGetMatch(request);
  }
}