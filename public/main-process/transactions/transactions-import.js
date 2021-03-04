const csvImporter = require('../services/fileApi/csv');
const logger = require('../services/logger/logger');

module.exports = class TransactionsImport {
  constructor() {
    this.sourceNode = null;
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

  setColumnMapping(request) {
    
  }
}