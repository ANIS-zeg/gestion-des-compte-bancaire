const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'enregistrement de l'utilisateur
router.post('/register', authController.register);

router.post('/login', authController.login);

// Route pour la déconnexion
// router.post('/logout', authController.logout);

module.exports = router;
