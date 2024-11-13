const Transaction = require('../models/Transaction');
const BankAccount = require('../models/BankAccount');
const Notification = require('../models/Notification');
const User = require('../models/User')
const { Op } = require('sequelize');
const { createObjectCsvStringifier } = require('csv-writer');

// exports.filterTransactionsByPeriod = async (req, res) => {
//   try {

//     const userId = req.user.id;
    
//     const { number, type } = req.query;

//     if (!number || !type || !['jours', 'mois', 'annees'].includes(type)) {
//       return res.status(400).json({ message: 'Invalid parameters. Specify a number and type (jours, mois, annees).' });
//     }

//     const periodValue = parseInt(number);

//     const fromDate = new Date();
//     switch (type) {
//       case 'jours':
//         fromDate.setDate(fromDate.getDate() - periodValue);
//         break;
//       case 'mois':
//         fromDate.setMonth(fromDate.getMonth() - periodValue);
//         break;
//       case 'annees':
//         fromDate.setFullYear(fromDate.getFullYear() - periodValue);
//         break;
//       default:
//         return res.status(400).json({ message: 'Invalid type. Use jours, mois, or annees.' });
//     }

//     const accountsWithTransactions = await BankAccount.findAll({
//       where: { user_id: userId },
//       include: [{
//         model: Transaction,
//         as: 'transactions',
//         where: fromDate ? { createdAt: { [Op.gte]: fromDate } } : {},
//         required: true
//       }]
//     });

//     const transactions = accountsWithTransactions.flatMap(account => account.transactions);

//     res.status(200).json({ transactions });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Error filtering transactions', error });
//   }
// };

exports.filterTransactionsByPeriod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { number, type, accountId } = req.query;

    let fromDate = null;

    if (number && type && ['days', 'months', 'years'].includes(type)) {
      const periodValue = parseInt(number);
      fromDate = new Date();

      switch (type) {
        case 'days':
          fromDate.setDate(fromDate.getDate() - periodValue);
          break;
        case 'months':
          fromDate.setMonth(fromDate.getMonth() - periodValue);
          break;
        case 'years':
          fromDate.setFullYear(fromDate.getFullYear() - periodValue);
          break;
        default:
          return res.status(400).json({ message: 'Invalid type. Use jours, mois, or annees.' });
      }
    }

    const accountCondition = accountId ? { id: accountId, user_id: userId } : { user_id: userId };

    const transactionCondition = fromDate ? { createdAt: { [Op.gte]: fromDate } } : {};

    const accountsWithTransactions = await BankAccount.findAll({
      where: accountCondition,
      include: [{
        model: Transaction,
        as: 'transactions',
        where: transactionCondition,
        required: true
      }]
    });

    const transactions = accountsWithTransactions.flatMap(account => account.transactions).reverse();

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error filtering transactions', error });
  }
};


exports.downloadTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const accountsWithTransactions = await BankAccount.findAll({
      where: { user_id: userId },
      include: [{
        model: Transaction,
        as: 'transactions',
        required: true
      }]
    });

    const transactions = accountsWithTransactions.flatMap(account => 
      account.transactions.map(transaction => ({
        accountName: account.name,
        date: transaction.createdAt,
        type: transaction.type,
        amount: transaction.amount,
        balance_after_transaction: transaction.balance_after_transaction
      }))
    );

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found to download.' });
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'accountName', title: 'Account Name' },
        { id: 'date', title: 'Date' },
        { id: 'type', title: 'Type' },
        { id: 'amount', title: 'Amount' },
        { id: 'balance_after_transaction', title: 'Balance After Transaction' }
      ]
    });

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(transactions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transaction_history.csv');
    res.status(200).send(csvContent);

  } catch (error) {
    res.status(500).json({ message: 'Error generating transaction history CSV', error });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.id; // Identifiant de l'utilisateur connecté
    const { accountId, type, amount, date } = req.body;

    // Validation des données
    if (!accountId || !type || !amount) {
      return res.status(400).json({ message: 'Account ID, type, and amount are required.' });
    }

    if (!['deposit', 'withdrawal'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type. Use "deposit" or "withdrawal".' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive.' });
    }

    // Recherche du compte bancaire
    const account = await BankAccount.findOne({ where: { id: accountId, user_id: userId } });

    if (!account) {
      return res.status(404).json({ message: 'Bank account not found.' });
    }

    // Vérification du solde pour un retrait
    if (type === 'withdrawal' && account.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds for withdrawal.' });
    }
    
     // Calcul du nouveau solde après la transaction
     let newBalance = type === 'deposit' ? parseFloat(account.balance) + parseFloat(amount) : parseFloat(account.balance) - parseFloat(amount);

     // Vérification du seuil de solde bas
     if (account.low_balance_threshold && newBalance < account.low_balance_threshold) {
      await Notification.create({
        account_id: accountId,
        type: "low_balance",
        message: `Le solde de votre compte ${account.name} est inférieur au seuil de ${account.low_balance_threshold}`,
        threshold: account.low_balance_threshold,
        user_id : userId
      });
    }

    
    // Création de la transaction
    const transaction = await Transaction.create({
      type,
      amount,
      date: date || new Date(), // Utiliser la date actuelle si non spécifiée
      balance_after_transaction: newBalance,
      account_id: accountId
    });

    // Mise à jour du solde du compte
    await account.update({ balance: newBalance });
      

    res.status(201).json({
      message: 'Transaction created successfully.',
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        balance_after_transaction: transaction.balance_after_transaction
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction', error });
  }
};



exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { accountId } = req.params; // ID du compte passé en paramètre
    const { type, startDate, endDate } = req.query; // Filtres optionnels

    // Vérifier que le compte appartient bien à l'utilisateur
    const account = await BankAccount.findOne({ where: { id: accountId, user_id: userId } });
    if (!account) {
      return res.status(404).json({ message: 'Bank account not found.' });
    }

    // Création des conditions de filtrage
    const whereClause = { account_id: accountId };
    if (type && ['deposit', 'withdrawal'].includes(type)) {
      whereClause.type = type;
    }
    if (startDate) {
      whereClause.date = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      whereClause.date = {
        ...whereClause.date,
        [Op.lte]: new Date(endDate)
      };
    }

    // Récupération des transactions avec filtres
    const transactions = await Transaction.findAll({
      where: whereClause,
      attributes: ['id', 'date', 'type', 'amount', 'balance_after_transaction'],
      order: [['date', 'DESC']]
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the specified filters.' });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transaction history', error });
  }
};
