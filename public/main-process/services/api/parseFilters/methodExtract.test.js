const moduleTest = require('./methodExtract');

describe("methodExtract", () => {
  test("create filter query with placeholders", () => {
    const [result, ] = moduleTest("((eq(aweraw, 'awer') and neq(awerawe, 'awer')) or gt(awer, 'awer))")
    expect(result).toEqual('((? and ?) or ?)');
  });

  test("extracts methods", () => {
    const [, result] = moduleTest("((eq(aweraw, 'awer') and neq(awerawe, 'awer')) or gt(awer, 'awer'))")
    expect(result).toEqual([
      {
        method: 'eq',
        parameters: ['aweraw', "'awer'"],
      },
      {
        method: 'neq',
        parameters: ['awerawe', "'awer'"],
      },
      {
        method: 'gt',
        parameters: ['awer', "'awer'"],
      }
    ]);
  });

  test("function is lower case", () => {
    const [, result] = moduleTest("EQ(aweraw, 'awer')")
    expect(result[0].method).toEqual('eq');
  });
});