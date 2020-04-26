const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

module.exports = async function nodesAdd(request) {
  logger.debug('Event - Node to add: ', request);
  const { uid, ...node } = request;

  if (!node.name) {
    throw new Error('Missing required field (name)');
  }

  if (!node.type) {
    throw new Error('Missing required field (type)');
  }

  const id = await storage.nodesAdd({
    name: node.name,
    type: node.type,
    isDefault: node.isDefault,
  });
  logger.debug(`Event - Node added with id: ${id}`);
  
  const newNode = {
    ...node,
    id,
  };

  return newNode;
}