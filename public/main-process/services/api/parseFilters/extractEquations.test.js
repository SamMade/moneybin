const moduleTest = require('./extractEquations');

describe("extractEquations", () => {
  test("extracts simple formula", () => {
    const [result, ] = moduleTest("((equals(aweraw, 'awer') and not(awerawe, 'awer')) or gt(awer, 'awer))")
    expect(result).toEqual('((? and ?) or ?)');
  });

  test("extracts methods", () => {
    const [, result] = moduleTest("((equals(aweraw, 'awer') and not(awerawe, 'awer')) or gt(awer, 'awer'))")
    expect(result).toEqual([
      {
        method: 'equals',
        parameters: ['aweraw', "'awer'"],
      },
      {
        method: 'not',
        parameters: ['awerawe', "'awer'"],
      },
      {
        method: 'gt',
        parameters: ['awer', "'awer'"],
      }
    ]);
  });
});