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

  it("inserts groupings", () => {
    const filterObj = {
      condition: ['and'],
      parameters: [{
        method: 'eq',
        parameters: ['a', "'a'"],
      }, {
        condition: ['or'],
        parameters: [{
          method: 'eq',
          parameters: ['b', "'b'"],
        }, {
          method: 'eq',
          parameters: ['c', "1"],
        }],
      }],
    };

    const [query, values] = moduleTest(filterObj)
    expect(query).toEqual('a = ? AND (b = ? OR c = ? ) ');
    expect(values).toEqual(['a', 'b', 1]);
  });
});
