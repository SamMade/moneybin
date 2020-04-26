/** @typedef {import('./extractEquations').equations} Equations */

/**
 * @typedef insertEquationsReturn
 * @type {Object}
 * @property {Array.<(Equations|insertEquationsReturn)>} parameters
 * @property {Array.<string>} condition
 */

/**
 * @param {import('./getConditionsNesting').getConditionsNestingReturn} conditions
 * @param {Array.<import('./extractEquations').equations>} equations
 * @returns {insertEquationsReturn}
 */
module.exports = function insertEquations(conditions, equations) {
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
