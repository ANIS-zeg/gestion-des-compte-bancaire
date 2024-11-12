// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/User'); // Assurez-vous que le modèle User est correctement importé

// Route pour récupérer le profil utilisateur
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); 
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil", error });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ message: "Profil mis à jour avec succès", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
  }
});

module.exports = router;
