const extractEquations = require('./extractEquations');
const getConditionsNesting = require('./getConditionsNesting');
const insertEquations = require('./insertEquations');

/**
 * This file is to parse a filter string into it's respective operations
 * @param {string} filterString The filter query
 * @returns {import('./insertEquations').insertEquationsReturn}
 */
module.exports = function parseFilters(filterString) {
  if (!filterString) { return null; }

  // extract equations
  const [noEquationsFilter, equations] = extractEquations(filterString);

  // identify groups and conditions
  const conditionsObject = getConditionsNesting(noEquationsFilter);

  // insert back equations
  return insertEquations(conditionsObject, equations);
}
