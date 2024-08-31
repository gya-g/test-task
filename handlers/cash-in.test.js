const { CashInHandler } = require('./cash-in');
const { roundUp } = require('../utils/rounding');
const { Http } = require('../services/http');

jest.mock('../utils/rounding');
jest.mock('../services/http');

describe('CashInHandler', () => {
  beforeEach(() => {
    CashInHandler.feePercentage = undefined;
    CashInHandler.maxFee = undefined;
  });

  test('should get fees if not already set', async () => {
    const mockFees = { percents: 0.03, max: { amount: 5 } };
    Http.get.mockResolvedValueOnce(mockFees);
    roundUp.mockImplementation((value) => value);

    const operation = { amount: 1000 };
    await CashInHandler.calculateFee({ operation });

    expect(Http.get).toHaveBeenCalledWith(expect.anything());
    expect(CashInHandler.feePercentage).toBe(mockFees.percents);
    expect(CashInHandler.maxFee).toBe(mockFees.max.amount);
  });

  test('should calculate the correct fee and round it up to max fee', async () => {
    CashInHandler.feePercentage = 0.03;
    CashInHandler.maxFee = 5;

    roundUp.mockImplementation((value) => value);

    const operation = { amount: 1000 };
    const fee = await CashInHandler.calculateFee({ operation });

    const expectedFee = 0.3; // 1000 * 0.03

    expect(fee).toBe(expectedFee);
    expect(roundUp).toHaveBeenCalledWith(expectedFee);
  });

  test('should calculate the correct fee below max fee and round it up', async () => {
    CashInHandler.feePercentage = 0.03;
    CashInHandler.maxFee = 5;
    roundUp.mockImplementation((value) => value);

    const operation = { amount: 100 };
    const fee = await CashInHandler.calculateFee({ operation });

    const expectedFee = 0.03;
    expect(fee).toBe(expectedFee);
    expect(roundUp).toHaveBeenCalledWith(expectedFee);
  });

  test('should return the rounded up value of the calculated fee', async () => {
    CashInHandler.feePercentage = 0.03;
    CashInHandler.maxFee = 5;
    roundUp.mockImplementation((value) => Math.ceil(value * 100) / 100);

    const operation = { amount: 105.56 };
    const fee = await CashInHandler.calculateFee({ operation });

    const expectedFee = 0.04; // 105.56 * 0.03
    expect(fee).toBe(expectedFee);
    expect(roundUp).toHaveBeenCalledWith(0.031668);
  });
});
