const express = require('express');
const router = express.Router();
const loginHistoryController = require('../controllers/loginHistoryController');

router.get('/history', loginHistoryController.getUserLoginHistory);

module.exports = router;