const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

module.exports = async function nodesGetNameAutocomplete(match) {
  logger.debug('Get Name Autocomplete', match);
  if (!match) {
    return null;
  }

  return await storage.nodesGetNameAutocomplete(match);
}