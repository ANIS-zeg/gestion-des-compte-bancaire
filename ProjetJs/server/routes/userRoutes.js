// userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification
const { getUserProfile, updateUserProfile, getTotalBalance } = require('../controllers/userController');

// Route pour récupérer le profil utilisateur (GET)
router.get('/profile', authMiddleware, getUserProfile);

// Route pour mettre à jour le profil utilisateur (PUT)
router.put('/profile', authMiddleware, updateUserProfile);

// Route pour obtenir le solde total de l'utilisateur
router.get('/total-balance', authMiddleware, getTotalBalance);

module.exports = router;
