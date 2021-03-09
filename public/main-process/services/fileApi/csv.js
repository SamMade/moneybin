const fileApi = require('./fileApi');
const logger = require('../logger/logger');

module.exports = class CSV extends fileApi {
  constructor() {
    super();

    this.headers = [];
    this.data = [];
  }

  async getHeaders() {
    logger.debug('CSV - getHeaders');
    if (!this.headers.length) {
      await this.parseHeaders();
    }

    return this.headers;
  }

  /**
   * Returns a memoized version of data
   */
  async getContent() {
    logger.debug('CSV - getContent');
    if (!this.data.length) {
      await this.load();
    }

    return this.data;
  }

  async preview(lines = 10) {
    logger.debug('CSV - preview');

    const fileLines = await this.getFile({ maxLines: lines + 1 });

    const csvLines = fileLines.map((line) => this.parseCsvLine(line));

    [this.headers] = csvLines.splice(0, 1);

    return {
      header: this.headers,
      body: csvLines,
    };
  }

  /**
   * Loads/Refreshes CSV data
   */
  async load() {
    logger.debug('CSV - load');

    const fileLines = await this.getFile();

    const csvLines = fileLines.map((line) => this.parseCsvLine(line));

    csvLines.splice(0, 1);

    this.data = csvLines;

    logger.debug(`Loading ${csvLines.length} lines`);
  }

  /**
   * @private
   */
  async parseHeaders() {
    const lines = await this.getFile({ maxLines: 1 });
    this.headers = this.parseCsvLine(lines[0]);
  }

  /**
   * Parse Line as CSV
   * @private
   * @param {string} line the line to parse
   */
  parseCsvLine(line) {
    const objPattern = new RegExp(
      '(\\,|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\,\\r\\n]*))',
      'gi'
    );
    const isMatch = line.match(objPattern);
    if (!isMatch) return [line];

    return isMatch.map((cell) => {
      const noQuotes = cell.replaceAll(/^(,\"|,|\")|\"$/g, '');
      return noQuotes;
    });
  }
};
