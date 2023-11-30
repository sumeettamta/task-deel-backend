const ContractService = require('../services/admin.service');

const getBestProfession = async (req, res) => {
    try {
        const contract = await ContractService.getBestProfession(req, res);
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

const getBestClients = async (req, res) => {
    try {
        const bestClients = await ContractService.getBestClients(req, res);
        if (!bestClients) {
          return res.status(404).end(`Contracts found`);;
        } else {
          return res
            .status(200)
            .json(bestClients);
        }
      } catch (error) {
        res
          .status(500)
          .json({ error });
      }
};

module.exports = { getBestProfession, getBestClients  };