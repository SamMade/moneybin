const logger = require('../../logger/logger');
const transformConditions = require('./conditions');
const transformMethods = require('./methods');

/**
 * @typedef Equations
 * @type {Object}
 * @property {string} method the name of the method
 * @property {string[]} parameters parameters the method has
 */

/**
 * @typedef filterObj
 * @type {Object}
 * @property {Array.<(Equations|filterObj)>} parameters
 * @property {string[]} condition
 */

/**
 * Takes filter object and transforms to sql where clause
 * @param {filterObj}
 * @returns {[string, string[]]} Returns the where clause and the values for the prepared statement
 */
module.exports = function(filterObj) {
  return setFilters(filterObj)
};

function setFilters(filterObj) {
  let sqlFilter = '';
  let sqlPrepared = [];

  filterObj.parameters.forEach((parameter, parameterIndex) => {
    const [queryString, preparedValues] = transformParameter(parameter);
    sqlFilter += queryString;
    sqlPrepared = sqlPrepared.concat(preparedValues);

    if (parameterIndex < filterObj.condition.length) {
      sqlFilter += `${transformConditions(filterObj.condition[parameterIndex])} `;
    }
  });

  return [sqlFilter, sqlPrepared];
}


function transformParameter(parameter) {
  // equation
  if (parameter.method) {
    return transformMethods(parameter);
  }

  const nextGroup = setFilters(parameter);
  return [`(${nextGroup[0]}) `, nextGroup[1]];
}
