const storage = require('../services/storage/storage');
const logger = require('../services/logger/logger');

const loggerContext = { service: 'Nodes/nodesPost' };

/**
 * @typedef {object} nodesPostRequest
 * @property {string} [id]
 * @property {string} name
 * @property {string} type
 * @property {boolean} isDefault
 * @property {string[]} alias
 */

/**
 * @typedef {object} nodesPostReturn
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {boolean} isDefault
 * @property {string[]} alias
 */


/**
 * Add / Update node
 * @param {nodesPostRequest} request
 * @returns {nodesPostReturn}
 */
module.exports = async function nodesPost(request) {
  logger.debug(JSON.stringify(request), loggerContext);

  const input = !Array.isArray(request) ? [request] : request;

  const mappedRequests = input.map((singleRequest) => {
    const { uid, ...node } = singleRequest;

    if (!node.name) {
      throw new Error('Missing required field (name)');
    }

    if (!node.type) {
      throw new Error('Missing required field (type)');
    }

    return tranformRequests(node);
  });

  const ids = await storage.nodesPost(mappedRequests);

  logger.info('Node upsert', `ids: ${ids.join(', ')}`, loggerContext);

  return input.map((node, nodeIndex) => ({ ...node, id: ids[nodeIndex] }));
};

/**
 * Takes api parameters and transforms them to storage parameters
 */
function tranformRequests(node) {
  return {
    id: node.id || undefined,
    name: node.name,
    type: node.type,
    alias: node.alias,
    isDefault: node.isDefault,
  };
}
