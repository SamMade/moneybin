const methodExtract = require('./methodExtract');
const getConditionsNesting = require('./getConditionsNesting');
const methodReinsert = require('./methodReinsert');

/**
 * This file is to parse a filter string into it's respective operations
 * @param {string} filterString The filter query
 * @returns {import('./methodReinsert').methodReinsertReturn}
 */
module.exports = function parseFilters(filterString) {
  if (!filterString) { return null; }

  // extract methods
  const [noEquationsFilter, methods] = methodExtract(filterString);

  // identify groups and conditions
  const conditionsObject = getConditionsNesting(noEquationsFilter);

  // insert back methods
  return methodReinsert(conditionsObject, methods);
}
