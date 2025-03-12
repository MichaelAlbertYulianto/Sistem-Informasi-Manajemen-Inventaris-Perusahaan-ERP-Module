const express = require('express');
const router = express.Router();

const inventory = require('./inventory.controller');

router.get('/inventory/overview', inventory.getOverviewInventory);
router.get('/inventory/download', inventory.downloadInvData);

module.exports = router;