const BankAccount = require('../models/BankAccount');
const Transaction = require('../models/Transaction');

exports.getUserAccounts = async (req, res) => {
  try {
    const userId = req.user.id; // Identifiant de l'utilisateur connecté

    const accounts = await BankAccount.findAll({
      where: { user_id: userId },
      attributes: ['id', 'name', 'balance', 'type'], // Affiche uniquement les champs nécessaires
      include: [
        {
          model: Transaction,
          as: 'transactions',
          attributes: ['id', 'type', 'amount', 'date', 'balance_after_transaction'],
          order: [['date', 'DESC']], // Trie les transactions par date
        }
      ]
    });

    res.status(200).json({ accounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching bank accounts', error });
  }
};


exports.createBankAccount = async (req, res) => {
    try {
      const userId = req.user.id; // Identifiant de l'utilisateur connecté
      const { name, type, low_balance_threshold } = req.body; // Données envoyées par le formulaire
  
      // Validation des données
      if (!name || !type) {
        return res.status(400).json({ message: 'Name and type are required.' });
      }
  
      // Si un seuil est spécifié, le convertir en nombre (assurez-vous que c'est un nombre valide)
      const threshold = low_balance_threshold ? parseFloat(low_balance_threshold) : null;
  
      // Création du compte bancaire
      const newAccount = await BankAccount.create({
        name,
        type,
        user_id: userId,
        balance: 0.0,
        low_balance_threshold: threshold, 
      });
  
      res.status(201).json({
        message: 'Bank account created successfully.',
        account: {
          id: newAccount.id,
          name: newAccount.name,
          type: newAccount.type,
          balance: newAccount.balance,
          low_balance_threshold: newAccount.low_balance_threshold, 
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating bank account', error });
    }
  };
  

exports.deleteBankAccount = async (req, res) => {
    const { accountId } = req.params;
    try {
      const bankAccount = await BankAccount.findOne({
        where: { id: accountId, user_id: req.user.id },
      });
  
      if (!bankAccount) {
        console.log("Compte bancaire non trouvé ou n'appartient pas à l'utilisateur connecté.");
        return res.status(404).json({ message: "Compte bancaire non trouvé." });
      }
  
      await Transaction.destroy({ where: { account_id: accountId } });
      await bankAccount.destroy();
  
      const userAccounts = await BankAccount.findAll({ where: { user_id: req.user.id } });
      const totalBalance = userAccounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
  
      res.status(200).json({
        message: "Compte bancaire supprimé avec succès.",
        totalBalance,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      res.status(500).json({
        message: "Erreur lors de la suppression du compte bancaire.",
        error,
      });
    }
  };

  exports.setLowBalanceThreshold = async (req, res) => {
    const { accountId } = req.params;
    const { threshold } = req.body;
  
    try {
      const bankAccount = await BankAccount.findOne({
        where: { id: accountId, user_id: req.user.id },
      });
  
      if (!bankAccount) {
        return res.status(404).json({ message: "Compte bancaire non trouvé." });
      }
  
      bankAccount.low_balance_threshold = threshold;
      await bankAccount.save();
  
      res.status(200).json({
        message: "Seuil de solde bas mis à jour avec succès.",
        threshold: bankAccount.low_balance_threshold,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du seuil de solde bas.", error });
    }
  };
  
