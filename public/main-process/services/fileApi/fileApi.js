const { promisify } = require("util");
const { once } = require("events");
const fs = require("fs");
const readline = require("readline");
const logger = require("../logger/logger");

const lstat = promisify(fs.lstat);

module.exports = class FileImporter {
  constructor() {
    this.filePath = null;
  }

  async setFilePath(path) {
    logger.debug("FileImporter - setFilePath");

    const fileStat = await lstat(path);

    if (!fileStat.isFile()) {
      this.filePath = null;
      return;
    }

    this.filePath = path;
    return this.filePath;
  }

  async getFile({ maxLines }) {
    logger.debug("FileImporter - getFile");

    if (!this.filePath) {
      logger.info(`Invalid path: ${this.filePath}`);
      return;
    }

    const readInterface = readline.createInterface({
      input: fs.createReadStream(this.filePath),
      output: process.stdout,
    });

    let lineCounter = 0;
    const wantedLines = [];
    readInterface.on("line", function (line) {
      lineCounter += 1;
      wantedLines.push(line);

      if (maxLines && lineCounter >= maxLines) {
        readInterface.close();
        readInterface.removeAllListeners()
      }
    });

    await once(readInterface, "close");

    return wantedLines;
  }
};