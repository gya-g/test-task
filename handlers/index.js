const { CashInHandler } = require('./cash-in');
const { CashOutHandler } = require('./cash-out');
const { operationTypes } = require('../constants/operations');

const calculateCommissionFee = (operation, weeklyAmounts) => {
  switch (operation.type) {
    case operationTypes.cashIn: {
      return CashInHandler.calculateFee(operation);
    }
    case operationTypes.cashOut: {
      return CashOutHandler.calculateFee(operation, weeklyAmounts);
    }
    default: {
      return null;
    }
  }
};

module.exports = {
  calculateCommissionFee,
};
