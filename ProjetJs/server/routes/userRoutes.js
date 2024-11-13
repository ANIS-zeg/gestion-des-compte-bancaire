// userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification
const { getUserProfile, updateUserProfile, getTotalBalance } = require('../controllers/userController');


router.get('/profile', authMiddleware, getUserProfile);

router.put('/profile', authMiddleware, updateUserProfile);

router.get('/total-balance', authMiddleware, getTotalBalance);

module.exports = router;
