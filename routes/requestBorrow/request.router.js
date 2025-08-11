const express = require('express');
const router = express.Router();

const request = require("./request.controller");

router.get("/requestborrow", request.getRequestPage);
router.post("/requestborrow", request.postRequestBorrow);

module.exports = router;