const { ipcMain } = require('electron');
const NodesService = require('./nodes');
const logger = require('../../../shared/services/logger/logger');

function emitNode(event) {
  logger.debug('Event - Nodes Updated');
  event.sender.send('nodes', nodes);
}

ipcMain.on('add-node', async (event, node) => {
  logger.debug('Add Node', node);

  // add to db
  const { "last_insert_rowid()":id } = await NodesService.addNode({
    name: node.name,
    type: node.type,
  });

  logger.info('Added Node to DB');
  return id;
});

ipcMain.on('remove-node', async (event, removedId) => {
  logger.debug('Remove Node', removedId);
  // remove from db
  await NodesService.removeNode({
    id: removedId,
  });
  logger.info('Removed Node from DB');

  // remove from UI
  const index = nodes.findIndex((item) => item.id == removedId);
  if (index !== -1) { 
    nodes.splice(index, 1);
    logger.info('Removed Node from UI state');
  }

  // announce
  emitNode(event);
});
