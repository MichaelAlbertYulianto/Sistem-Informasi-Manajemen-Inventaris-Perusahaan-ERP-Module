const express = require('express');
const router = express.Router();

const inventory = require('./inventory.controller');

router.get('/inventory/overview', inventory.getOverviewInventory);
router.get('/inventory/download', inventory.downloadInvData);
router.get('/inventory/add', inventory.LoadaddInventory);
router.post('/inventory/add', inventory.addInventoryPost);
router.get('/inventory/edit/:id', inventory.LoadEditInventory);
router.post('/inventory/edit/:id', inventory.editInventoryPost);
router.post('/inventory/delete/:id', inventory.deleteInventory);
router.get('/inventory/status', inventory.LoadInventoryStatus);
router.get('/inventory/status/download', inventory.downloadInventoryStatus);

module.exports = router;