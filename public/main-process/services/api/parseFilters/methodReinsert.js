/** @typedef {import('./methodExtract').equations} Equations */

/**
 * @typedef methodReinsertReturn
 * @type {Object}
 * @property {Array.<(Equations|methodReinsertReturn)>} parameters
 * @property {Array.<string>} condition
 */

/**
 * @param {import('./getConditionsNesting').getConditionsNestingReturn} conditions
 * @param {Array.<import('./methodExtract').equations>} equations
 * @returns {methodReinsertReturn}
 */
module.exports = function methodReinsert(conditions, equations) {
  const equationsBuffer = [].concat(equations);

  return recursiveInsert(conditions, equationsBuffer);
};

function recursiveInsert(conditions, equations) {
  conditions.parameters = conditions.parameters.map((parameter) => {
    if (parameter === '?') {
      const equation = equations[0];
      equations.shift();
      return equation;
    }

    return recursiveInsert(parameter, equations);
  })

  return conditions;
}
