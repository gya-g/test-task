const { roundUp } = require('../utils/rounding');
const { CASH_IN_FEES } = require('../configs/endpoints');
const { Http } = require('../services/http');

class CashInHandler {
  static feePercentage;
  static maxFee;

  static getFees = async () => {
    const res = await Http.get(CASH_IN_FEES);

    this.feePercentage = res.percents;
    this.maxFee = res.max.amount;
  };

  static calculateFee = async ({ operation }) => {
    if (!this.feePercentage) {
      await this.getFees();
    }

    const fee = (operation.amount * this.feePercentage) / 100;

    return roundUp(Math.min(fee, this.maxFee));
  };
}

module.exports = { CashInHandler };
