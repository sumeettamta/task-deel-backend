const router = require("express").Router();
const { getAllUnpaid, payForJob } = require("../controllers/jobs.controllers");

router.get("/unpaid", getAllUnpaid);
router.post("/:job_id/pay", payForJob);

module.exports = router;