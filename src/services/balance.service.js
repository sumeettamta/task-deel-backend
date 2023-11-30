const depositAmount = async (req, res) => {
    const { Profile, Job, Contract } = req.app.get('models');
    const { userId } = req.params;
    const { depositAmt } = req.body;
    if (!depositAmt) return res.status(400).end('depositAmt is required');

    const client = await Profile.findOne({
        where: { id: userId }
    });
    if (!client) return res.status(404).end('client not found');

    const { id } = req.profile;
    const totalUnpaid = await Job.sum('price', {
        where: {
            paid: null
        },
        include: [
            {
                model: Contract,
                where: { status: 'in_progress' },
                include: [
                    {
                        model: Profile,
                        as: 'Client',
                        where: { id }
                    }
                ]
            }
        ]
    });
    const depositLmt = totalUnpaid / 4;

    if (depositAmt >= depositLmt) return res.status(400).end(`A client can't deposit more than 25% his total of jobs to pay`);

    await client.increment({ balance: depositAmt });

    return `${depositAmt} succesfully deposited. Current Balance - ${client.balance}`
};

module.exports = { depositAmount };