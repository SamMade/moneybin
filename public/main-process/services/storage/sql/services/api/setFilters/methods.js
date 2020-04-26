const logger = require('../../logger/logger');

module.exports = function transformEquation(methodObj) {
  switch (methodObj.method) {
    case 'eq':
      return [`${methodObj.parameters[0]} = ? `, [valueWithCorrectType(methodObj.parameters[1])]];
    case 'neq':
      return [`${methodObj.parameters[0]} <> ? `, [valueWithCorrectType(methodObj.parameters[1])]];
    case 'gt':
      return [`${methodObj.parameters[0]} > ? `, [valueWithCorrectType(methodObj.parameters[1])]];
    case 'gte':
      return [`${methodObj.parameters[0]} >= ? `, [valueWithCorrectType(methodObj.parameters[1])]];
    case 'lt':
      return [`${methodObj.parameters[0]} < ? `, [valueWithCorrectType(methodObj.parameters[1])]];
    case 'lte':
      return [`${methodObj.parameters[0]} <= ? `, [valueWithCorrectType(methodObj.parameters[1])]];
    default:
      logger.error(`Unrecognized Method: ${methodObj.method}`);
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