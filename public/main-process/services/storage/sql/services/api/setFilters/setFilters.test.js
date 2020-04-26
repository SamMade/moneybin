const moduleTest = require('./setFilters');

describe("setFilters", () => {
  it("inserts equations", () => {
    const filterObj = {
      condition: ['and'],
      parameters: [{
        method: 'eq',
        parameters: ['a', "'a'"],
      }, {
        method: 'eq',
        parameters: ['b', "1"],
      }],
    };

    const [query, values] = moduleTest(filterObj)
    expect(query).toEqual('a = ? AND b = ? ');
    expect(values).toEqual(['a', 1]);
  });
});
