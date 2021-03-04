const fileApi = require("./fileApi");
const logger = require("../logger/logger");

module.exports = class CSV extends fileApi {
  constructor() {
    super();

    this.headers = [];
  }

  async getHeaders() {
    logger.debug("CSV - getHeaders");
    if (!this.headers.length) {
      await this.parseHeaders();
    }

    return this.headers;
  }

  async preview(lines = 10) {
    logger.debug("CSV - preview");

    const fileLines = await this.getFile({ maxLines: lines + 1 });

    const csvLines = fileLines.map((line) => this.parseCsvLine(line));

    [this.headers] = csvLines.splice(0, 1);

    return {
      header: this.headers,
      body: csvLines,
    };
  }

  /**
   * @private
   */
  async parseHeaders() {
    const lines = await this.getFile({ maxLines: 1 });
    this.headers = this.parseCsvLine(lines[0]);
  }

  /**
   *
   * @private
   * @param {string} line the line to parse
   */
  parseCsvLine(line) {
    const objPattern = new RegExp(
      '(\\,|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\,\\r\\n]*))',
      "gi"
    );
    const isMatch = line.match(objPattern);
    if (!isMatch) return [line];

    return isMatch.map((cell) => {
      const noQuotes = cell.replaceAll(/^(,\"|,|\")|\"$/g, "");
      return noQuotes;
    });
  }
};
