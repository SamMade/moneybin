const logger = require('../logger/logger');

class Storage {
  constructor() {
    this.nodesAdd = null;
    this.nodesRemove = null;
    this.nodesGet = null;
    this.nodesGetMany = null;
    this.nodesGetNameAutocomplete = null;
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
    
    const adapterInstance = new adapter(params);
    
    this.nodesAdd = adapterInstance.nodesAdd;
    this.nodesRemove = adapterInstance.nodesRemove;
    this.nodesGet = adapterInstance.nodesGet;
    this.nodesGetMany = adapterInstance.nodesGetMany;
    this.nodesGetNameAutocomplete = adapterInstance.nodesGetNameAutocomplete;
    this.transactionsAdd = adapterInstance.transactionsAdd;
    this.transactionsRemove = adapterInstance.transactionsRemove;
    this.transactionsGet = adapterInstance.transactionsGet;
    this.transactionsGetMany = adapterInstance.transactionsGetMany;
    this.close = adapterInstance.close;

    const adapterInit = await adapterInstance.init();

    logger.info('Storage Adapter Connected');
    return adapterInit;
  }
}

/**
 * Singleton
 */
module.exports = new Storage();