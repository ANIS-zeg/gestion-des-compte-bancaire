const BankAccount = require('../models/BankAccount');
const Transaction = require('../models/Transaction');

exports.getUserAccounts = async (req, res) => {
  try {
    const userId = req.user.id; // Identifiant de l'utilisateur connecté

    const accounts = await BankAccount.findAll({
      where: { user_id: userId },
      attributes: ['id', 'name', 'balance'], // Affiche uniquement les champs nécessaires
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
    const { name, type } = req.body; // Données envoyées par le formulaire

    // Validation des données
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required.' });
    }

    // Création du compte bancaire
    const newAccount = await BankAccount.create({
      name,
      type,
      user_id: userId,
      balance: 0.0
    });

    res.status(201).json({
      message: 'Bank account created successfully.',
      account: {
        id: newAccount.id,
        name: newAccount.name,
        type: newAccount.type,
        balance: newAccount.balance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating bank account', error });
  }
};