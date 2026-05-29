const express = require('express');
const router = express.Router();
const { checkStatus } = require('../controllers/publicController');

router.post('/status', checkStatus);

module.exports = router;
