// controllers/userController.js
const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await User.create({ email, password, name });
    res.status(201).json({ message: 'Utilisateur créé', user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur' });
  }
};
