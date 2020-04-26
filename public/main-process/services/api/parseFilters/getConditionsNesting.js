/**
 * @typedef getConditionsNestingReturn
 * @type {Object}
 * @property {Array.<(string|getConditionsNestingReturn)>} parameters
 * @property {Array.<string>} condition
 */

/**
 * Creates object to represent groupings and conditions
 * @param {string} inputString placeholder filter string
 * @returns {getConditionsNestingReturn}
 */
module.exports = function getConditionsNesting(inputString) {
  const [result] = recursiveNesting(inputString.toLowerCase());
  return result;
}

function recursiveNesting(inputString) {
  const result = {
    parameters: [],
    condition: [],
  };

  let i = 0;
  let capturePointer = 0;
  let groupsOpen = 0;
  while (i < inputString.length) {
    const theChar = inputString.charAt(i);

    // end group
    if (theChar === ')') {
      groupsOpen -= 1;
      if (groupsOpen < 0) {
        return [result, i];
      }
      i += 1;
      capturePointer = i;
      continue;
    }

    // start group
    if (theChar === '(' && i < inputString.length - 1) {
      groupsOpen += 1;
      // recursion
      const [parameter, pos] = recursiveNesting(inputString.substr(i + 1));
      result.parameters.push(parameter);
      i += pos + 1;
      capturePointer = i;
      continue;
    }

    // parameter
    if (theChar === '?') {
      result.parameters.push('?');
      i += 1;
      capturePointer = i;
      continue;
    }

    // grab condition
    if (theChar === ' ' && i !== capturePointer) {
      result.condition.push(inputString.substr(capturePointer, i - capturePointer));
      i += 1;
      capturePointer = i;
      continue;
    }

    // skip spaces
    if (theChar === ' ' && i === capturePointer) {
      i += 1;
      capturePointer = i;
      continue;
    }

    i += 1;
  }

  if (groupsOpen !== 0) {
    throw new Error('Mismatch Parentheses');
  }

  return [result, i];
}