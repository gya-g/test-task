const { roundUp } = require('../utils/rounding');
const { userTypes } = require('../constants/users');
const { getWeekNumber } = require("../utils/date");
const { CASH_OUT_JURIDICAL, CASH_OUT_NATURAL } = require('../configs/endpoints');
const { Http } = require('../services/http');

class CashOutHandler {
  static juridicalFeePercentage;
  static juridicalMinAmount;

  static naturalFeePercentage;
  static naturalNoFeeLimit;

  static getJuridicalFees = async () => {
    const res = await Http.get(CASH_OUT_JURIDICAL);

    this.juridicalFeePercentage = res.percents;
    this.juridicalMinAmount = res.min.amount;
  };

  static getNaturalFees = async () => {
    const res = await Http.get(CASH_OUT_NATURAL);

    this.naturalFeePercentage = res.percents;
    this.naturalNoFeeLimit = res.week_limit.amount;
  };

  static calculateJuridicalFee = async (amount) => {
    if (!this.juridicalFeePercentage) {
      await this.getJuridicalFees();
    }

    const fee = (amount * this.juridicalFeePercentage) / 100;

    return roundUp(Math.max(fee, this.juridicalMinAmount));
  };

  static getNaturalTaxableAmount = (weekAmount, amount) => {
    if (weekAmount <= this.naturalNoFeeLimit) {
      return 0;
    }

    if (amount > this.naturalNoFeeLimit) {
      return amount - this.naturalNoFeeLimit;
    }

    return amount;
  };

  static calculateNaturalFee = async ({ operation, date, user_id }, weeklyAmount) => {
    if (!this.naturalFeePercentage) {
      await this.getNaturalFees();
    }

    const weekNumber = getWeekNumber(new Date(date));
    const weekAmount = weeklyAmount[user_id][weekNumber];
    const amount = operation.amount;
    const taxableAmount = this.getNaturalTaxableAmount(weekAmount, amount);
    const fee = (taxableAmount * this.naturalFeePercentage) / 100;

    return roundUp(fee);
  };

  static calculateFee = async (data, weeklyAmounts) => {
    if (data.user_type === userTypes.juridical) {
      return this.calculateJuridicalFee(data.operation.amount);
    }

    return this.calculateNaturalFee(data, weeklyAmounts);
  };
}

module.exports = { CashOutHandler };
