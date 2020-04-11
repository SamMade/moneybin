const logger = require('../../../../shared/services/logger/logger');

class Storage {
  constructor() {
    this.nodesAdd = null;
    this.nodesRemove = null;
    this.nodesGetAll = null;
    this.nodesGetNameAutocomplete = null;
    this.transactionsAdd = null;
    this.transactionsRemove = null;
    this.transactionsGetAll = null;
    this.close = null;
  }

  async init(adapter, ...params) {
    if (!adapter) {
      throw new Error('Missing Storage Adapter');
    }
    
    const adapterInstance = new adapter(params);
    
    this.nodesAdd = adapterInstance.nodesAdd;
    this.nodesRemove = adapterInstance.nodesRemove;
    this.nodesGetAll = adapterInstance.nodesGetAll;
    this.nodesGetNameAutocomplete = adapterInstance.nodesGetNameAutocomplete;
    this.transactionsAdd = adapterInstance.transactionsAdd;
    this.transactionsRemove = adapterInstance.transactionsRemove;
    this.transactionsGetAll = adapterInstance.transactionsGetAll;
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