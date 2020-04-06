const { ipcMain } = require('electron');
const logger = require('../../../shared/services/logger/logger');

const nodesGetAll = require('./nodes-getAll');
const nodesAdd = require('./nodes-add');

module.exports = class Nodes {
  constructor() {
    this.nodes = [];

    ipcMain.on('nodes-getAll', this.getAllNodes.bind(this));
    ipcMain.on('nodes-add', this.addNode.bind(this));

    logger.info('Service: Nodes ...ready');
  }

  async init() {
    const allNodes = await nodesGetAll();
    this.nodes = allNodes;

    logger.info('Service: Nodes init ...complete');
    return;
  }

  addNode(event, request) {
    logger.debug('Node to add: ', request);
    const { uid, ...node } = request;
  
    nodesAdd(node)
      .then((id) => {
        const newNode = {
          ...node,
          id,
        };

        this.nodes.push(newNode);

        logger.debug(`Event - Node added (${uid})`);
        event.reply('nodes-getAll-reply', this.nodes);
        event.reply('nodes-add-reply', uid);
      });
  }

  // removeNode({id}) {
  //   return dataStore.removeNode(id);
  // }

  getAllNodes(event) {
    logger.debug('Get Nodes');
    event.reply('nodes-getAll-reply', this.nodes);
  }
}