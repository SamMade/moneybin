const logger = require('../../logger/logger');

/** 
 * Provides a whitelist of methods allowed
 * and validates inputs necessary
 */
module.exports = function methodValidate(methodObj) {
  switch (methodObj.method) {
    case 'eq':
      if (
        (methodObj.parameters.length !== 2)
        && (methodObj.parameters.length !== 1)
      ) {
        logger.error('Method (eq): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'neq':
      if (
        (methodObj.parameters.length !== 2)
        && (methodObj.parameters.length !== 1)
      ) {
        logger.error('Method (neq): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'in':
      if (methodObj.parameters.length < 2) {
        logger.error('Method (in): requires at least 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'gt':
      if (methodObj.parameters.length !== 2) {
        logger.error('Method (gt): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'gte':
      if (methodObj.parameters.length !== 2) {
        logger.error('Method (gte): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'lt':
      if (methodObj.parameters.length !== 2) {
        logger.error('Method (lt): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    case 'lte':
      if (methodObj.parameters.length !== 2) {
        logger.error('Method (lte): requires only 2 parameters')
        throw new Error('METHOD_INVALID_INPUT');
      }
      break;
    default:
      logger.error(`Unrecognized Method: ${methodObj.method}`)
      throw new Error('METHOD_UNDEFINED');
  }
}