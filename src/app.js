const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.use(getProfile);
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
const adminRouter = require("./routes/admin.routes");
const balancesRouter = require("./routes/balances.routes");
const contractsRouter = require("./routes/contracts.routes");
const jobsRouter = require("./routes/job.routes");



app.use("/admin", adminRouter);
app.use("/balances", balancesRouter);
app.use("/contracts", contractsRouter);
app.use("/jobs", jobsRouter);

module.exports = app;
