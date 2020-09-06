const dialog = require('electron').dialog;
const logger = require("../services/logger/logger");

module.exports = async function adminGetFilePath() {
  logger.debug("Event - File Dialog Open: ", );

  const paths = await dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
  return paths;
};
