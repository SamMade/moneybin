module.exports = function extractEquations(filterString) {
  const equationFormat = /([\w]+)\(((\s*('[^']*'|"[^"]*"|[^),]*)\s*,?\s*)*)\)/g;
  const paramFormat = /[^\s'"),][^\s,)]*|'[^']*'|"[^"]*"/g;
  const equations = [];

  const matchFunction = (match, method, params, offset, string) => {
    let matches;
    const parameters = [];
    while (matches = paramFormat.exec(params)) {
      parameters.push(matches[0]);
    }
  
    equations.push({
      method,
      parameters,
    });

    return '?';
  };

  const simpleFilterString = filterString.replace(equationFormat, matchFunction);

  return [simpleFilterString, equations];
}