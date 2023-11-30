const router = require("express").Router();
const { depositAmount } = require("../controllers/balance.controllers");

router.post("/deposit/:userId", depositAmount);

module.exports = router;