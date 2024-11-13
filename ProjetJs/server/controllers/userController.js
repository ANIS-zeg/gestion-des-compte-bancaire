const bcrypt = require('bcrypt');
const User = require('../models/User');
const BankAccount = require('../models/BankAccount');

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

// Mise à jour du profil utilisateur avec changement de mot de passe optionnel
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const user = await User.findOne({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (currentPassword && newPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message || 'Erreur serveur'
        });
    }
};

// Calcul du solde total des comptes bancaires
const getTotalBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const accounts = await BankAccount.findAll({ where: { user_id: userId } });

        const totalBalance = accounts.reduce((acc, account) => acc + parseFloat(account.balance), 0);

        res.json({ totalBalance });
    } catch (error) {
        console.error("Erreur lors du calcul du solde total :", error);
        res.status(500).json({ message: "Erreur lors du calcul du solde total", error });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getTotalBalance
};
