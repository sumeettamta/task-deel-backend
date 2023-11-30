const JobsService = require("../services/jobs.service");

const getAllUnpaid = async (req, res) => {
  try {
    const unpaidJobs = await JobsService.getAllUnpaid(req, res);
    if (!unpaidJobs) {
      res.status(404).end(`Contract not found`);
    } else {
      res.status(200).json(unpaidJobs);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const payForJob = async (req, res) => {
  try {
    const jobDetails = await JobsService.payForJob(req, res);
    if (!jobDetails) {
      return res.status(404).end(`job not found`);
    } else {
      return res.status(200).json(jobDetails);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  getAllUnpaid,
  payForJob,
};
