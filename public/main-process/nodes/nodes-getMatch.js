const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

const loggerContext = { service: 'Nodes/nodesGetMatch' };

/**
 * @typedef {object} Matches
 * @property {string} id 
 * @property {string} name 
 * @property {number} score the lower the number the more relevant 
 */

/**
 * @param {string} searchText
 * @returns {Matches[]}
 */
module.exports = async function nodesGetMatch(searchText) {
  logger.debug(searchText, loggerContext);

  if (!searchText) {
    return null;
  }

  return storage.nodesMatch(searchText);
}