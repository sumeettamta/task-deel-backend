const { Op } = require("sequelize");

const getContractsById = async (req, res) => {
    const { Contract } = req.app.get('models');
    const userId = req.profile.id;
    const type = req.profile.type;

    const { id } = req.params;

    if(!id) return res.status(400).end('contract id is required');

    let whereQ = { id };
    if (type == 'client') {
        whereQ.ClientId = userId;
    } else {
        whereQ.ContractorId = userId;
    }
    const contract = await Contract.findOne({ where: whereQ });

    if (!contract) return res.status(404).end('Contract not found');
    return contract;
} 

const getAllContracts = async (req, res) => {
    const { Contract } = req.app.get('models');
    const { id, type } = req.profile;

    let whereQ = {
        [Op.not]: [
            { status: 'terminated' }
        ]
    };

    if (type == 'client') {
        whereQ.ClientId = id;
    } else {
        whereQ.ContractorId = id;
    }

    const contracts = await Contract.findAll({ where: whereQ });
    return contracts;
} 

module.exports = { getContractsById, getAllContracts };