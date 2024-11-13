// userController.js
const User = require('../models/User');
const BankAccount = require('../models/BankAccount');

// Récupération du profil utilisateur
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['id', 'name', 'email'] 
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération du profil',
      error: error.message || 'Erreur serveur'
    });
  }
};

// Mise à jour du profil utilisateur
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body; // Récupérer les champs à modifier

    // Mise à jour de l'utilisateur connecté
    const [updated] = await User.update(
      { name, email },
      { where: { id: req.user.id } }
    );

    if (updated) {
      const updatedUser = await User.findOne({
        where: { id: req.user.id },
        attributes: ['id', 'name', 'email']
      });
      return res.json({ message: 'Profil mis à jour avec succès', user: updatedUser });
    }

    throw new Error('Erreur lors de la mise à jour du profil');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message || 'Erreur serveur'
    });
  }
};

const getTotalBalance = async (req, res) => {
    try {
      const userId = req.user.id; // ID de l'utilisateur connecté
      const accounts = await BankAccount.findAll({ where: { user_id: userId } });
  
      // Calcul du solde total
      const totalBalance = accounts.reduce((acc, account) => acc + parseFloat(account.balance), 0);
  
      res.json({ totalBalance });
    } catch (error) {
      console.error("Erreur lors du calcul du solde total :", error);
      res.status(500).json({ message: "Erreur lors du calcul du solde total", error });
    }
  };

  // Mise à jour du mot de passe de l'utilisateur
const updateUserPassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      // Récupérer l'utilisateur par son ID
      const user = await User.findOne({ where: { id: req.user.id } });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Vérifier si le mot de passe actuel est correct
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }
  
      // Hash du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Mise à jour du mot de passe de l'utilisateur
      await User.update(
        { password: hashedPassword },
        { where: { id: req.user.id } }
      );
  
      res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe :', error);
      res.status(500).json({
        message: 'Erreur lors de la mise à jour du mot de passe',
        error: error.message || 'Erreur serveur'
      });
    }
  };
  

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getTotalBalance
};
