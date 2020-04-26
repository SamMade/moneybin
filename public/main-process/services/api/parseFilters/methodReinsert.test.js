const moduleTest = require('./methodReinsert');

describe("methodReinsert", () => {
  it("inserts methods", () => {
    const conditions = {
      condition: ['and'],
      parameters: ['?', '?'],
    };
    const methods = [
      {
        method: 'eq',
        parameters: ['a', "'a'"],
      },
      {
        method: 'eq',
        parameters: ['b', "'b'"],
      }
    ]

    const result = moduleTest(conditions, methods)
    expect(result).toEqual({
      condition: ['and'],
      parameters: [{
        method: 'eq',
        parameters: ['a', "'a'"],
      }, {
        method: 'eq',
        parameters: ['b', "'b'"],
      }],
    });
  });
});
