const map = require('lodash/map');
const uniq = require('lodash/uniq');

const csvImporter = require('../services/fileApi/csv');

/**
 * Import Class
 */
module.exports = class FileImport {
  constructor() {
    /**
     * CSV file instance
     * @private
     */
    this.file = new csvImporter(); 
    
    /**
     * source node id
     * @public
     */
    this.sourceNode = null; 

    /**
     * @typedef {import('../transactions/transactions').Transaction} transaction
     * @property {string} target
     */

    /**
     * transaction data from csv
     * @type {transaction[]}
     * @public
     */
    this.transactions = null; // file transformed to transactions
    
    /**
     * array of what the csv column is
     * Possible values: '', 'target, 'amount', 'date', 'notes'
     * @type {string[]}
     * @public
     */
    this.columnMappings = [];
  }

  /**
   * @returns {string} filePath 
   */
  getFilePath() {
    return this.file.filePath;
  }

  /**
   * @param {string} filePath 
   */
  async setFilePath(filePath) {
    const result = await this.file.setFilePath(filePath);
    return result;
  }

  /**
   * @param {string|number} id source node id
   */
  async setSourceNode(id) {
    this.sourceNode = id;
  }

  /**
   * Return small preview of csv
   */
  async preview(){
    const result = await this.file.preview();
    return result;
  }

  /**
   * Denote what csv column is what attribute
   * @param {string[]} request attribute by column index
   */
  async setColumnMapping(request) {
    const headers = await this.file.getHeaders();
    if (request.length !== headers.length) {
      throw new Error('Header length Mismatch');
    }

    this.columnMappings = request;
  }

  /**
   * Transform csv into transactions
   */
  async setTransactions() {
    if (!this.columnMappings.length || !this.columnMappings.some((c) => !!c)) {
      throw new Error('Mappings not configured');
    }

    const data = await this.file.getContent();

    this.transactions = data.map((row) => {
      const transaction = {};
      this.columnMappings.forEach((key, rowIndex) => {
        if (!key) { return; }

        let value;
        switch (key) {
          case 'amount':
            value = parseFloat(row[rowIndex]);
            break;
          default:
            value = row[rowIndex];
        }

        transaction[key] = value;
      })
      
      return transaction;
    });
  }

  /**
   * List of target names from csv
   * @returns {string[]}
   */
  async getTargets() {
    if (!this.transactions.length) {
      throw new Error('Transactions not loaded');
    }

    const transactions = map(this.transactions, 'target')
    if (!transactions || !transactions.length) {
      return [];
    }
  
    return uniq(transactions);
  }

  /**
   * @typedef {object} Target
   * @property {string|number} node id of node
   * @property {boolean} addAsAlias true to save name as alias
   * 
   */

   /**
    * Get nodes that need creating
    * @param {Object.<string, Target>} targets 
    * @return {import('../nodes/nodes').Node[]}
    */
  getNodesToCreate(targets) {
    return Object.keys(targets).reduce((arr, name) => {
      if (targets[name].node === 'create') {
        arr.push({
          name,
        });
      }
      return arr;
    }, []);
  }
};
