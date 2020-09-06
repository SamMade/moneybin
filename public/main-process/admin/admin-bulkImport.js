const fs = require("fs");
const { promisify } = require("util");
const logger = require("../services/logger/logger");

module.exports.bulkImportPreview = async function adminBulkImport(request) {
  logger.debug("Event - Bulk Import: ");

  try {
    const data = await promisify(fs.readFile(request, "utf-8"))
  
    console.log("The file content is : " + data);
  } catch(err) {
    console.error("An error ocurred reading the file :" + err.message);
  }
};
