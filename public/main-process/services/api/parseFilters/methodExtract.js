const validateEquation = require('./methodValidate');
const logger = require('../../logger/logger');

/**
 * @typedef methods
 * @type {Object}
 * @property {string} method the name of the method
 * @property {string[]} parameters parameters the method has
 */

/**
 * @typedef extractMethodsReturn
 * @type {Array}
 * @property {string} 0 - filter string with placeholders on the methods.
 * @property {Array.<methods>} 1 - equation/method objects
 */
 
/**
 * @param {string} filterString
 * @returns {extractMethodsReturn}
 */
module.exports = function extractMethods(filterString) {
  const methodFormat = /([\w]+)\(((\s*('[^']*'|"[^"]*"|[^),]*)\s*,?\s*)*)\)/g;
  const paramFormat = /[^\s'"),][^\s,)]*|'[^']*'|"[^"]*"/g;
  const methods = [];

  const matchFunction = (match, method, params, offset, string) => {
    let matches;
    const parameters = [];
    while (matches = paramFormat.exec(params)) {
      parameters.push(matches[0]);
    }

    const methodName = method.toLowerCase();
  
    const methodObj = {
      method: methodName,
      parameters,
    };

    validateEquation(methodObj);
  
    methods.push(methodObj);

    return '?';
  };

  logger.debug(`Found ${methods.length} methods used in query`);

  const simpleFilterString = filterString.replace(methodFormat, matchFunction);

  return [simpleFilterString, methods];
}
