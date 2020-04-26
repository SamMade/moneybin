const moduleTest = require('./insertEquations');

describe("insertEquations", () => {
  it("inserts equations", () => {
    const conditions = {
      condition: ['and'],
      parameters: ['?', '?'],
    };
    const equations = [
      {
        method: 'equals',
        parameters: ['a', "'a'"],
      },
      {
        method: 'equals',
        parameters: ['b', "'b'"],
      }
    ]

    const result = moduleTest(conditions, equations)
    expect(result).toEqual({
      condition: ['and'],
      parameters: [{
        method: 'equals',
        parameters: ['a', "'a'"],
      }, {
        method: 'equals',
        parameters: ['b', "'b'"],
      }],
    });
  });
});
