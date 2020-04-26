const moduleTest = require('./setFilters');

describe("setFilters", () => {
  it("inserts equations", () => {
    const filterObj = {
      condition: ['and'],
      parameters: [{
        method: 'equals',
        parameters: ['a', "'a'"],
      }, {
        method: 'equals',
        parameters: ['b', "1"],
      }],
    };

    const [query, values] = moduleTest(filterObj)
    expect(query).toEqual('a = ? AND b = ? ');
    expect(values).toEqual(['a', 1]);
  });
});
