const router = require("express").Router();
const { getContractById, getAllContracts  } = require("../controllers/contracts.controllers");

router.get("/", getAllContracts);
router.get("/:id", getContractById);

module.exports = router;