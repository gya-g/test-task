const { roundUp } = require('./rounding');

describe('roundUp', () => {
  test('should round up to the nearest cent', () => {
    expect(roundUp(1.234)).toBe(1.24);
    expect(roundUp(1.201)).toBe(1.21);
    expect(roundUp(1.999)).toBe(2.00);
    expect(roundUp(0.005)).toBe(0.01);
    expect(roundUp(0)).toBe(0.00);
  });

  test('should handle integer inputs correctly', () => {
    expect(roundUp(1)).toBe(1.00);
    expect(roundUp(123)).toBe(123.00);
  });

  test('should handle negative inputs correctly', () => {
    expect(roundUp(-1.234)).toBe(-1.23);
    expect(roundUp(-1.201)).toBe(-1.20);
    expect(roundUp(-1.999)).toBe(-1.99);
    expect(roundUp(-0.005)).toBe(-0.00);
  });
});
