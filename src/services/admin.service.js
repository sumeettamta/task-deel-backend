const { Op } = require("sequelize");
const { sequelize } = require('../model');

const getBestProfession = async (req, res) => {
    const { Contract, Profile, Job } = req.app.get('models');
    const { start, end } = req.query;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate == 'Invalid Date' || endDate == 'Invalid Date') return res.status(400).end('Start and end must be valid dates specified in YYYY-MM-DD format');

    const bestProfessions = await Profile.findAll({
        attributes: [ 
            "profession", 
            [sequelize.fn("SUM", sequelize.col("price")), "earned"]
        ],
        include: [{
            model: Contract,
            as: "Contractor",
            attributes: [],
            required: true,
            include: [{
                model: Job, 
                required: true,
                attributes: [],
                where: {
                    paid: true,
                    [Op.or]: [
                        {
                            createdAt: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        {
                            updatedAt: {
                                [Op.between]: [startDate, endDate]
                            }
                        }
                    ]
                }
            }]
        }],
        where: {
            type: "contractor"
        },
        group: [ "profession" ],
        order: [ [sequelize.col("earned"), "DESC"] ],
        limit : 1,
        subQuery: false
    });

    if (bestProfessions.length == 0) return res.status(404).end('No best profession found in this period of time');

    return bestProfessions;
};

const getBestClients = async (req, res) => {
    const { Contract, Profile, Job } = req.app.get('models');
    const { start, end } = req.query;
    let { limit } = req.query;
    limit = parseInt(limit ? limit : 2);

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate == 'Invalid Date' || endDate == 'Invalid Date') return res.status(400).end('Start and end must be valid dates specified in YYYY-MM-DD format');
    if (isNaN(limit)) return res.status(400).end('limit is invalid');
    const bestClients = await Profile.findAll({
        attributes: [ 
            "id",
            [sequelize.literal("firstName || ' ' || lastName"), "fullName"],
            [sequelize.fn("SUM", sequelize.col("price")), "paid"]
        ],
        include: [{
            model: Contract,
            as: "Client",
            attributes: [],
            required: true,
            include: [{
                model: Job, 
                required: true,
                attributes: [],
                where: {
                    paid: true,
                    paymentDate: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                }
            }]
        }],
        where: {
            type: "client"
        },
        group: [ "Profile.id" ],
        order: [ [sequelize.col("paid"), "DESC"] ],
        limit : limit,
        subQuery: false
    });
    return bestClients
};

module.exports = { getBestClients, getBestProfession };