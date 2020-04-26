const logger = require('../../logger/logger');

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
      sqlFilter += `${transformCondition(filterObj.condition[parameterIndex])} `;
    }
  });

  return [sqlFilter, sqlPrepared];
}

function transformCondition(condition) {
  switch(condition) {
    case 'and':
      return 'AND';
    default:
      logger.error(`Unrecognized Condition: ${condition}`);
      throw new Error('CONDITION_UNDEFINED');
  }
}

function transformParameter(parameter) {
  // equation
  if (parameter.method) {
    return transformEquation(parameter);
  }

  const nextGroup = setFilters(parameter);
  return [`(${nextGroup[0]}) `, nextGroup[1]];
}

function transformEquation(equation) {
  switch (equation.method) {
    case 'equals':
      return [`${equation.parameters[0]} = ? `, [valueWithCorrectType(equation.parameters[1])]]
    default:
      logger.error(`Unrecognized Method: ${equation.method}`);
      throw new Error('METHOD_UNDEFINED');
  }
}

function valueWithCorrectType(input) {
  const stringRegex = /^'(.+)'|"(.+)"$/;
  const isString = input.match(stringRegex);
  
  // return string without quotes
  if (isString) {
    return isString[1] || isString[2];
  }

  // return number
  if (!isNaN(input)) {
    return +input;
  }
}