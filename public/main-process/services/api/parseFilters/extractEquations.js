const logger = require('../../logger/logger');

/**
 * @typedef equations
 * @type {Object}
 * @property {string} method the name of the method
 * @property {string[]} parameters parameters the method has
 */

/**
 * @typedef extractEquationsReturn
 * @type {array}
 * @property {string} 0 - filter string with placeholders on the methods.
 * @property {Array.<equations>} 1 - equation/method objects
 */
 
/**
 * @param {string} filterString
 * @returns {extractEquationsReturn}
 */
module.exports = function extractEquations(filterString) {
  const equationFormat = /([\w]+)\(((\s*('[^']*'|"[^"]*"|[^),]*)\s*,?\s*)*)\)/g;
  const paramFormat = /[^\s'"),][^\s,)]*|'[^']*'|"[^"]*"/g;
  const equations = [];

  const matchFunction = (match, method, params, offset, string) => {
    let matches;
    const parameters = [];
    while (matches = paramFormat.exec(params)) {
      parameters.push(matches[0]);
    }

    const methodName = method.toLowerCase();
  
    const equation = {
      method: methodName,
      parameters,
    };

    validateEquation(equation);
  
    equations.push(equation);

    return '?';
  };

  const simpleFilterString = filterString.replace(equationFormat, matchFunction);

  return [simpleFilterString, equations];
}

/** 
 * Provides a whitelist of methods allowed
 * and validates inputs necessary
 */
function validateEquation(equation) {
  switch (equation.method) {
    case 'equals':
      if (equation.parameters.length !== 2) {
        logger.error('Method (equals): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'not':
      if (equation.parameters.length !== 2) {
        logger.error('Method (equals): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'gt':
      if (equation.parameters.length !== 2) {
        logger.error('Method (equals): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    default:
      logger.error(`Unrecognized Method: ${equation.method}`)
      throw new Error('METHOD_UNDEFINED');
  }
}