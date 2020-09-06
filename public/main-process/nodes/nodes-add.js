const storage = require("../services/storage/storage");
const logger = require("../services/logger/logger");

/**
 * @typedef nodesAddReturn
 * @type {object}
 * @property {string} id
 */

/**
 * @typedef nodesAddRequest
 * @type {object}
 * @property {string} name
 * @property {string} type
 * @property {boolean} isDefault
 */

/**
 * Add node
 * @param {nodesAddRequest} request
 * @returns {nodesAddRequest & nodesAddReturn}
 */
module.exports = async function nodesAdd(request) {
  logger.debug("Event - Node to add: ", request);

  const input = !Array.isArray(request) ? [request] : request;

  const mappedRequests = input.map((singleRequest) => {
    const { uid, ...node } = singleRequest;

    if (!node.name) {
      throw new Error("Missing required field (name)");
    }

    if (!node.type) {
      throw new Error("Missing required field (type)");
    }

    return tranformRequests(node);
  });

  const ids = await storage.nodesAdd(mappedRequests);

  logger.debug(`Event - Node added with id: ${ids.join(", ")}`);

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
