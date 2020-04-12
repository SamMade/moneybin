module.exports = function getNesting(inputString) {
  const output = {
    type: null,
    expressions: [],
  };

  let pos = 0;
  let startPos = 0;
  let parenthesesCounter = 0;
  let apostropheCounter = 0;
  let quoteCounter = 0;
  let prevChar = null;

  while(pos < inputString.length) {
    const theChar = inputString[pos];

    if (output.type === null) {
      // find grouping
      if (theChar === '(' && (prevChar === null || prevChar === ' ' || prevChar === '(')) {
        startPos = pos;
        output.type = 'grouping';
      }
    } else {
      // find grouping
      if (output.type === 'grouping') {
        if (theChar === '(') { parenthesesCounter += 1; }
        if (theChar === "'") { apostropheCounter += }
        if (theChar === '"') { quoteCounter += 1; }

        if (theChar === ')' && (
            (parenthesesCounter > 0)
            || (apostropheCounter > 0)
            || (quoteCounter > 0)
          )
        ) { parenthesesCounter -= 1; }

      }
    }

    prevChar = theChar;
    pos += 1;
  }

  return output;
};

//   const expressionGroups = groups.map((group) => {
//     return splitAndComparators(inputString.substring(group.startPos+1, group.endPos));
//   })

// console.log(JSON.stringify(expressionGroups))
//   return groups;

function splitAndComparators(inputString) {
  const splitAnd = inputString.toLowerCase().split(' and ');

  if (splitAnd.length > 0) {
    return ({
      condition: 'and',
      expressions: splitAnd.map((expression) => ({ expressions: splitOrComparators(expression) })),
    })
  }

  return {
    expressions: [inputString],
  };
}

function splitOrComparators(inputString) {
  const splitOr = inputString.toLowerCase().split(' or ');

  if (splitOr.length > 0) {
    return ({
      condition: 'and',
      expressions: splitOr.map((expression) => ({ expressions: [expression]})),
    })
  }

  return {
    expressions: [inputString],
  };
}