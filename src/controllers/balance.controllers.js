const BalanceService = require('../services/balance.service');

const depositAmount = async (req, res) => {
  try {
    const depositAmountRes = await BalanceService.depositAmount(req, res);
    
    return res.status(200).json({
      msg : depositAmountRes
    });
    
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
};

  module.exports = {
    depositAmount
  };
