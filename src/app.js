const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const identifyRoutes = require("./routes/identify.routes");
const connectDB = require("./config/db");

require("dotenv").config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", identifyRoutes);

module.exports = app;
