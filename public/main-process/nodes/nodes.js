const { ipcMain } = require('electron');
const logger = require('../../../shared/services/logger/logger');

const nodesGetAll = require('./nodes-getAll');
const nodesAdd = require('./nodes-add');
const nodesRemove = require('./nodes-remove');

module.exports = class Nodes {
  constructor() {
    this.nodes = [];

    ipcMain.on('nodes-getAll', this.getAllNodes.bind(this));
    ipcMain.handle('nodes-add', this.addNode.bind(this));
    ipcMain.handle('nodes-remove', this.removeNode.bind(this));

    logger.info('Service: Nodes ...ready');
  }

  async init() {
    const allNodes = await nodesGetAll();
    this.nodes = allNodes;

    logger.info('Service: Nodes init ...complete');
    return;
  }

  async addNode(event, request) {
    // try {
      const newNode = await nodesAdd(request);

      this.nodes.push(newNode);
  
      event.sender.send('nodes-getAll-reply', this.nodes);
      return newNode.id;
    // } catch (e) {
    //   return e;
    // }
  }

  async removeNode(event, request) {
    const isFoundIndex = this.nodes.findIndex((node) => node.id === nodeId);
    if (isFoundIndex === -1) {
      return null;
    }

    const nodeId = await nodesRemove(request);

    const copy = Array.from(this.nodes);
    copy.splice(isFoundIndex, 1);
    this.nodes = copy;
  
    event.sender.send('nodes-getAll-reply', this.nodes);
    return nodeId;
  }

  getAllNodes(event) {
    event.reply('nodes-getAll-reply', this.nodes);
  }
}