const ContractService = require('../services/contracts.service');

const getContractById = async (req, res) => {
  try {
    const contract = await ContractService.getContractsById(req, res);
    if (!contract) {
      res.status(404).end(`Contract not found`);
    } else {
      res.status(200).json(contract);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
};

const getAllContracts = async (req, res) => {
    try {
      const contracts = await ContractService.getAllContracts(req, res);
      if (!contracts) {
        return res.status(404).end(`Contracts found`);;
      } else {
        return res
          .status(200)
          .json(contracts);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error });
    }
  };
  
  module.exports = {
    getContractById,
    getAllContracts,
  };
