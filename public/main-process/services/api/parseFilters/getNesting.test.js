const moduleTest = require('./getNesting');

describe("getNesting", () => {
  test("sees AND", () => {
    const result = moduleTest('equals(a) and (equals(b) or equals(c))')
    expect(result).toEqual({
      condition: 'group',
      expressions: ['equals(a)', 'equals(bye)'],
    });
  });

  // test("creates 2 layer groups", () => {
  //   const result = moduleTest('((hello) and (bye))')
  //   expect(result).toEqual([['hello'], ['bye']]);
  // });
});