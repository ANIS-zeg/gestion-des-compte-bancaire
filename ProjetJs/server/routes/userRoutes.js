// userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification
const { getUserProfile, updateUserProfile, getTotalBalance, getConnectionHistory } = require('../controllers/userController');


router.get('/profile', authMiddleware, getUserProfile);

router.put('/profile', authMiddleware, updateUserProfile);

router.get('/total-balance', authMiddleware, getTotalBalance);

router.get('/connection-history', authMiddleware, getConnectionHistory);

module.exports = router;
