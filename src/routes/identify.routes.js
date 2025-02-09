const express = require("express");
const { identifyContact } = require("../controllers/identify.controller");

const router = express.Router();

router.post("/identify", identifyContact);

module.exports = router;
