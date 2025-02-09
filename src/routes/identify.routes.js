const express = require("express");
const router = express.Router();
const { identify } = require("../controllers/identify.controller");

router.post("/identify", identify);

module.exports = router;
