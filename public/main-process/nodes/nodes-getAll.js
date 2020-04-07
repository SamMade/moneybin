const storage = require('../services/storage/storage');
const logger = require('../../../shared/services/logger/logger');

module.exports = async function nodesGetAll() {
  logger.debug('Get Nodes');
  return await storage.nodesGetAll();
}