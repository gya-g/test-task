const { getWeeklyAmount } = require('./limits');

describe('getWeeklyAmount', () => {
  test('should return the correct weekly amounts for cash out operations', () => {
    const operations = [
      { user_id: 1, type: 'cash_out', operation: { amount: 100 }, date: '2024-07-10' },
      { user_id: 1, type: 'cash_out', operation: { amount: 200 }, date: '2024-07-11' },
      { user_id: 2, type: 'cash_out', operation: { amount: 300 }, date: '2024-07-11' },
      { user_id: 1, type: 'cash_in', operation: { amount: 400 }, date: '2024-07-12' },
      { user_id: 2, type: 'cash_in', operation: { amount: 500 }, date: '2024-07-13' },
      { user_id: 1, type: 'cash_out', operation: { amount: 600 }, date: '2024-07-17' },
    ];

    const result = getWeeklyAmount(operations);

    expect(result).toEqual({
      1: {
        28: 300, // Week 28: 100 + 200
        29: 600  // Week 29: 600
      },
      2: {
        28: 300  // Week 28: 300
      }
    });
  });

  test('should return an empty object if there are no cash out operations', () => {
    const operations = [
      { user_id: 1, type: 'cash_in', operation: { amount: 100 }, date: '2024-07-10' },
      { user_id: 2, type: 'cash_in', operation: { amount: 200 }, date: '2024-07-11' },
    ];

    const result = getWeeklyAmount(operations);

    expect(result).toEqual({});
  });
});
