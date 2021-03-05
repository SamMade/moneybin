const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

const loggerContext = { service: 'Nodes/nodesRemove' };

/**
 * @typedef {object} removeRequest
 * @property {string} uid unique id for transaction
 * @property {string} nodeId node id to remove
 */

/**
 * @param {removeRequest} request 
 */
module.exports = async function nodesRemove(request) {
  logger.debug(JSON.stringify(request), loggerContext);

  const { uid, nodeId } = request;

  if (!nodeId) {
    throw new Error('Missing required field (nodeId)');
  }

  // add to db
  await storage.nodesRemove(nodeId);

  logger.info(`Node Removed (${nodeId})`, loggerContext);

  return nodeId;
}