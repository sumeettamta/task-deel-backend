const { sequelize } = require('../model');

const getAllUnpaid = async (req, res) => {
    const { Contract, Job } = req.app.get('models');
    const { id, type } = req.profile;

    let whereQ = { status: 'in_progress' };
    if (type == 'client') {
        whereQ.ClientId = id;
    } else {
        whereQ.ContractorId = id;
    }

    const jobs = await Job.findAll({
        where: {
            paid: null
        },
        include: [
            {
                model: Contract,
                where: whereQ
            }
        ]
    });

    return jobs 
};

const payForJob = async (req, res) => {
    const { Contract, Job, Profile } = req.app.get('models');
    const { job_id } = req.params;
    const { id, balance } = req.profile;

    let whereQ = {
        id : job_id,
        paid : null
    }
    const job = await Job.findOne({
        where: whereQ,
        include: [
            {
                model: Contract,
                where: { ClientId: id }
            }
        ]
    });

    if (!job) return res.status(404).end('Unpaid job not found for user');
    if (balance < job.price) return res.status(400).end('Insufficient Balance');
  
    const client = req.profile;
    const contractor = await Profile.findOne({
        where: {
            id: job.Contract.ContractorId,
            type: "contractor"
        }
    });
    if (!contractor) return res.status(404).end('contractor not found');

    const paymentTransaction = await sequelize.transaction();

    try {
        await client.decrement({ balance: job.price }, { paymentTransaction });
        await contractor.increment({ balance: job.price }, { paymentTransaction });
        await job.update({ paid: true, paymentDate: Date.now() }, { paymentTransaction });

        await paymentTransaction.commit();
        return job
    } catch (error) {
        await paymentTransaction.rollback();
        return res.status(500).end('Payment failed');
    }
};

module.exports = { getAllUnpaid, payForJob };