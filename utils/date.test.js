const { getWeekNumber } = require('./date');

describe('getWeekNumber', () => {
  test('should return the correct week number for a given date in the same year', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-07-10');
    const date3 = new Date('2024-12-31');

    expect(getWeekNumber(date1)).toBe(1);
    expect(getWeekNumber(date2)).toBe(28);
    expect(getWeekNumber(date3)).toBe(1); // Adjusted for week numbering edge cases
  });

  test('should handle dates at the beginning and end of the year correctly', () => {
    const date1 = new Date('2024-01-03'); // Should be in the first week
    const date2 = new Date('2024-12-28'); // Should be in the last week

    expect(getWeekNumber(date1)).toBe(1);
    expect(getWeekNumber(date2)).toBe(52);
  });

  test('should correctly handle leap years', () => {
    const date1 = new Date('2024-02-29'); // Leap year date
    const date2 = new Date('2023-02-28'); // Non-leap year date

    expect(getWeekNumber(date1)).toBe(9); // 2024 is a leap year
    expect(getWeekNumber(date2)).toBe(9); // 2023 is not a leap year
  });
});
