const logger = require('../logger/logger');

const loggerContext = { service: 'Storage' };

/**
 * @typedef {import('../../nodes/nodes-post').nodesPostRequest} NodeAdd
 * @typedef {import('../../nodes/nodes-get').getRequest} NodeGet
 * @typedef {import('../../nodes/nodes-getMany').getManyRequest} NodeGetMany 
 */

class Storage {
  constructor() {
    this.adapterInstance = null;
  
    this.transactionsAdd = null;
    this.transactionsRemove = null;
    this.transactionsGet = null;
    this.transactionsGetMany = null;
    this.close = null;
  }

  // TODO: allow different adapter per domain
  async init(adapter, ...params) {
    if (!adapter) {
      throw new Error('Missing Storage Adapter');
    }
    
    const adapterInstance = new adapter(logger, params);
    this.adapterInstance = adapterInstance;
    
    this.transactionsAdd = adapterInstance.transactionsAdd;
    this.transactionsRemove = adapterInstance.transactionsRemove;
    this.transactionsGet = adapterInstance.transactionsGet;
    this.transactionsGetMany = adapterInstance.transactionsGetMany;
    this.close = adapterInstance.close;

    const adapterInit = await adapterInstance.init({ logger });

    logger.info('Adapter Connected', loggerContext);
    return adapterInit;
  }

  /**
   * Add / Update Nodes
   * @param {NodeAdd[]} nodes 
   */
  async nodesPost(nodes) {
    logger.debug('request: nodesPost', loggerContext);
    return this.adapterInstance.nodesPost({ logger, nodes });
  }

  /**
   * Get Single Nodes
   * @param {NodeGet} params 
   */
  async nodesGet(params) {
    logger.debug('request: nodesGet', loggerContext);
    return this.adapterInstance.nodesGet({ logger, ...params });
  }

  /**
   * Get Multiple Nodes
   * @param {NodeGetMany} params 
   */
  async nodesGetMany(params) {
    logger.debug('request: nodesGetMany', loggerContext);
    return this.adapterInstance.nodesGetMany({ logger, ...params });
  }

  /**
   * Remove Node
   * @param {string} id 
   */
  async nodesRemove(id) {
    logger.debug('request: nodesRemove', loggerContext);
    return this.adapterInstance.nodesRemove({ logger, id });
  }

  /**
   * Finds Name by autocomplete
   * @param {string} id 
   */
  async nodesMatch(searchTerm) {
    logger.debug('request: nodesMatch', loggerContext);
    return this.adapterInstance.nodesMatch({ logger, searchTerm });
  }

  /**
   * Finds Name by autocomplete
   * @param {string} id 
   */
  async nodesGetNameAutocomplete(searchTerm) {
    logger.debug('request: nodesGetNameAutocomplete', loggerContext);
    return this.adapterInstance.nodesGetNameAutocomplete({ logger, searchTerm });
  }
}

/**
 * Singleton
 */
module.exports = new Storage();
