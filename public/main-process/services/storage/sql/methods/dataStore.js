'use strict';

const Storage = require('../../storage');
const storage = new Storage();

module.exports = {
  init: async function setup() {
    await storage.init();

    console.log('Storage init ...complete');
  },
  close: storage.close,
  
};
