const logger = require('../../logger/logger');

module.exports = function transformCondition(condition) {
  switch(condition) {
    case 'and':
      return 'AND';
    case 'or':
      return 'OR';
    default:
      logger.error(`Unrecognized Condition: ${condition}`);
      throw new Error('CONDITION_UNDEFINED');
  }
}