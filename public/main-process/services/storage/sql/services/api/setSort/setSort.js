/**
 * @typedef sortObj
 * @type {object}
 * @property {string} order + or -
 * @property {string[]} fields attributes to sort on
 */

/**
 * Takes sort object and transforms to sql ORDER BY clause
 * @param {sortObj}
 * @returns {string} Returns the sort clause
 */
module.exports = function(sortObj) {
  if (!sortObj) return '';

  const order = (sortObj.order === '-') ? 'DESC' : 'ASC' // ASC is default anyway

  return `${sortObj.fields.join(', ')} ${order}`;
};
