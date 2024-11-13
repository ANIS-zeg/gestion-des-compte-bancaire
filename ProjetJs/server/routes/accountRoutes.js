const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/list', authMiddleware, accountController.getUserAccounts);

router.post('/add', authMiddleware, accountController.createBankAccount);

router.delete('/:accountId', authMiddleware, accountController.deleteBankAccount);

// User-defined threshold for low balance
router.put('/account/:accountId/threshold', authMiddleware, accountController.setLowBalanceThreshold);


module.exports = router;