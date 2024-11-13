const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/list', authMiddleware, accountController.getUserAccounts);

router.post('/add', authMiddleware, accountController.createBankAccount);

module.exports = router;