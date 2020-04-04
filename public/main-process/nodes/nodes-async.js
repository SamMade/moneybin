const { ipcMain } = require('electron');

function emitNode() {
  console.log('Event - Nodes Updated');
  event.sender.send('nodes', nodes);
}

ipcMain.on('add-node', async (event, node) => {
  console.log('Add Node', node);
  // add to db
  const {"last_insert_rowid()":id} = await NodesService.addNode({
    name: node.name,
    type: node.type,
  });
  console.info('Added Node to DB');

  // add to UI
  nodes.push({
    ...node,
    id,
  });

  // announce
  emitNode(event);
});

ipcMain.on('remove-node', async (event, removedId) => {
  console.log('Remove Node', removedId);
  // remove from db
  await NodesService.removeNode({
    id: removedId,
  });
  console.info('Removed Node from DB');

  // remove from UI
  const index = nodes.findIndex((item) => item.id == removedId);
  if (index !== -1) { 
    nodes.splice(index, 1);
    console.info('Removed Node from UI state');
  }

  // announce
  emitNode(event);
});
