const extractEquations = require('./extractEquations');
/**
 * This file is to parse a filter string into it's respective operations
 */
module.exports = function parseFilters(filterString) {
  // extract equations
  const [noEquationsFilter, equations] = extractEquations(filterString);

  // identify groups

  // identify conditionals


}
