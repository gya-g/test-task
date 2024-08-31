const { CashOutHandler } = require('./cash-out');
const { roundUp } = require('../utils/rounding');
const { Http } = require('../services/http');
const { getWeekNumber } = require('../utils/date');
const { userTypes } = require('../constants/users');
const { CASH_OUT_JURIDICAL, CASH_OUT_NATURAL } = require('../configs/endpoints');

jest.mock('../utils/rounding');
jest.mock('../services/http');
jest.mock('../utils/date');

describe('CashOutHandler', () => {
  beforeEach(() => {
    CashOutHandler.juridicalFeePercentage = undefined;
    CashOutHandler.juridicalMinAmount = undefined;
    CashOutHandler.naturalFeePercentage = undefined;
    CashOutHandler.naturalNoFeeLimit = undefined;
  });

  test('should get juridical fees if not already set', async () => {
    const mockFees = { percents: 0.3, min: { amount: 0.5 } };
    Http.get.mockResolvedValueOnce(mockFees);
    roundUp.mockImplementation((value) => value);

    const amount = 1000;
    await CashOutHandler.calculateJuridicalFee(amount);

    expect(Http.get).toHaveBeenCalledWith(CASH_OUT_JURIDICAL);
    expect(CashOutHandler.juridicalFeePercentage).toBe(mockFees.percents);
    expect(CashOutHandler.juridicalMinAmount).toBe(mockFees.min.amount);
  });

  test('should calculate the correct juridical fee and round it up to minimum fee', async () => {
    CashOutHandler.juridicalFeePercentage = 0.3;
    CashOutHandler.juridicalMinAmount = 0.5;
    roundUp.mockImplementation((value) => value);

    const amount = 100;
    const fee = await CashOutHandler.calculateJuridicalFee(amount);

    const expectedFee = (amount * 0.3) / 100;
    const roundedFee = 0.5; // Math.max(expectedFee, minAmount)

    expect(fee).toBe(roundedFee);
    expect(roundUp).toHaveBeenCalledWith(roundedFee);
  });

  test('should get natural fees if not already set', async () => {
    const mockFees = { percents: 0.3, week_limit: { amount: 1000 } };
    Http.get.mockResolvedValueOnce(mockFees);
    roundUp.mockImplementation((value) => value);

    const data = { operation: { amount: 1000 }, user_id: 1, date: '2024-07-15' };
    const weeklyAmounts = { 1: { 28: 500 } };
    await CashOutHandler.calculateNaturalFee(data, weeklyAmounts);

    expect(Http.get).toHaveBeenCalledWith(CASH_OUT_NATURAL);
    expect(CashOutHandler.naturalFeePercentage).toBe(mockFees.percents);
    expect(CashOutHandler.naturalNoFeeLimit).toBe(mockFees.week_limit.amount);
  });
});

