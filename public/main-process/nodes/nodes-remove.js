const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

module.exports = async function nodesRemove(request) {
  logger.debug('Node to remove: ', request);
  const { uid, nodeId } = request;

  if (!nodeId) {
    throw new Error('Missing required field (nodeId)');
  }

  // add to db
  await storage.nodesRemove(nodeId);
  logger.debug(`Event - Node Removed (${nodeId})`);

  return nodeId;
}