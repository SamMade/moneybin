import logger from '../../logger/logger';
import Nodes from '../../../models/nodes';
import Transactions from '../../../models/transactions';

/**
 * Makes sure the attributes conform to the schema
 */
module.exports = function transformAttributes(attribute) {
  if (attribute.indexOf('.') !== -1) {
    const namespaceAttribute = attribute.split('.');
    if (namespaceAttribute.length !== 2) {
      logger.error(`Unknown attribute (${attribute})`)
      throw new Error('INVALID_ATTRIBUTE');
    }

    const namespace = Nodes[namespaceAttribute[0]];
  }
  return;
};
