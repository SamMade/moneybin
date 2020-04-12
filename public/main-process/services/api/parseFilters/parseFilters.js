const getNesting = require('./getNesting');

/**
 * This file is to parse a filter string into it's respective operations
 */
module.exports = function parseFilters(filterString) {
  const nestedGroups = getNesting(filterString);
}
