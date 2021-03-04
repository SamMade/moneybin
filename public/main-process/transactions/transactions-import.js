const csvImporter = require('../services/fileApi/csv');
const logger = require('../services/logger/logger');

module.exports = class TransactionsImport {
  constructor() {
    this.sourceNode = null;
    this.targetNodes = {};
    this.file = new csvImporter();
    this.columnMappings = [];
  }

  async setFilePath(filePath) {
    const result = await this.file.setFilePath(filePath);
    return result;
  }

  async preview(){
    const result = await this.file.preview();
    return result;
  }

  async setColumnMapping(request) {
    const headers = await this.file.getHeaders();
    if (request.length !== headers.length) {
      throw new Error('Header length Mismatch');
    }

    this.columnMappings = request;
  }

  async getTargetMatches() {
    const targetIndex = this.columnMappings.findIndex((column) => column === 'target');

    if (targetIndex === -1) {
      throw new Error('No Target Column');
    }

    const data = await this.file.getContent();

    data.forEach((row) => {
      const targetName = row[targetIndex];
      
      if (this.targetNodes.hasOwnProperty(targetName)) {
        return;
      }

      // Find if match any name

      // Find if match any alias

      // Best Guess?
      this.targetNodes[targetName] = '?';

      // Should create
      this.targetNodes[targetName] = null;
    });

    return this.targetNodes;
  }
}