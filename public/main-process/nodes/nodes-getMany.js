const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

module.exports = async function nodesGetMany(request) {
  logger.debug('Get Nodes Many');
  return await storage.nodesGetMany(request);
}