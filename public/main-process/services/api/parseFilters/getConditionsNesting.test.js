const moduleTest = require('./getConditionsNesting');

describe("getConditionsNesting", () => {
  it("sees multiple conditions", () => {
    const result = moduleTest('? and ? or ? and ?')
    expect(result).toEqual({
      condition: ['and', 'or', 'and'],
      parameters: ['?', '?', '?', '?'],
    });
  });

  it("sees 1-level nesting", () => {
    const result = moduleTest('? and (? or ?) or (? and ?) and ?')
    expect(result).toEqual({
      condition: ['and', 'or', 'and'],
      parameters: [
        '?',
        {
          condition: ['or'],
          parameters: ['?', '?'],
        },
        {
          condition: ['and'],
          parameters: ['?', '?'],
        },
        '?'
      ],
    });
  });

  it("sees 2-level nesting", () => {
    const result = moduleTest('? and (? or (? or ?))')
    expect(result).toEqual({
      condition: ['and'],
      parameters: ['?', {
        condition: ['or'],
        parameters: ['?', {
          condition: ['or'],
          parameters: ['?', '?'],
        }],
      }],
    });
  });

  it("makes conditions lowercase", () => {
    const result = moduleTest('? AND ? or ?')
    expect(result).toEqual({
      condition: ['and', 'or'],
      parameters: ['?', '?', '?'],
    });
  });
});
