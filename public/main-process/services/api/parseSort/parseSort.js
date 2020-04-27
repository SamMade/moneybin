const logger = require('../../logger/logger');

/**
 * @typedef parseSort
 * @type {object}
 * @property {string} order + or -
 * @property {string[]} fields attributes to sort on
 */

/**
 * This file is to parse a sort string into it's respective parts
 * @param {string} sortString The sort query
 * @returns {parseSort}
 */
module.exports = function parseSort(sortString) {
  if (!sortString) { return null; }

  if (sortString.length < 2 || (sortString.charAt(0) !== '-' &&  sortString.charAt(0) !== '+')) {
    logger.error('Sort string must start with a + or -');
    throw new Error('INVALID_SORT');
  }

  return {
    order: sortString.charAt(0),
    fields: sortString.substr(1).split(','),
  };
}
