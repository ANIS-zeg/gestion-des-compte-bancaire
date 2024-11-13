const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware')

router.get('/filter', authMiddleware, transactionController.filterTransactionsByPeriod);

router.get('/download-history', authMiddleware, transactionController.downloadTransactionHistory);

router.post('/add', authMiddleware, transactionController.createTransaction);

router.get('/history/:accountId', authMiddleware, transactionController.getTransactionHistory);

module.exports = router;
