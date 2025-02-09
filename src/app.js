const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const identifyRoutes = require("./routes/identify.routes");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", identifyRoutes);

module.exports = app;
