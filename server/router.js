const express = require('express');
const router = express.Router();
const clientCtrl = require('./controller/client');

router.get('/client', clientCtrl.getClientDetails);
router.get('/clients', clientCtrl.getClients);

module.exports = router;
