const { calculateCommissionFee } = require('./handlers');
const { getWeeklyAmount } = require('./utils/limits');

const processOperations = async (operations) => {
  const weeklyAmounts = getWeeklyAmount(operations);
  const fees = [];

  for (const operation of operations) {
    const fee = await calculateCommissionFee(operation, weeklyAmounts);

    fees.push(fee.toFixed(2));
  }

  return fees;
};

module.exports = { processOperations };
