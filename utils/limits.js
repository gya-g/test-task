const { operationTypes } = require("../constants/operations");
const { getWeekNumber } = require("../utils/date");

const getWeeklyAmount = (operations) => {
  return operations.reduce((acc, { user_id, type, operation, date }) => {
    if (type !== operationTypes.cashOut) {
      return acc;
    }

    const weekNumber = getWeekNumber(new Date(date));

    if (!acc[user_id]) {
      acc[user_id] = {};
    }

    if (!acc[user_id][weekNumber]) {
      acc[user_id][weekNumber] = operation.amount;
    } else {
      acc[user_id][weekNumber] += operation.amount;
    }

    return acc;
  }, {})
};

module.exports = {
  getWeeklyAmount,
}
