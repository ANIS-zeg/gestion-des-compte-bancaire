const Transaction = require('../models/Transaction');
const BankAccount = require('../models/BankAccount');
const User = require('../models/User')
const { Op } = require('sequelize');
const { createObjectCsvStringifier } = require('csv-writer');

exports.filterTransactionsByPeriod = async (req, res) => {
  try {

    const userId = req.user.id;
    
    const { number, type } = req.query;

    if (!number || !type || !['jours', 'mois', 'annees'].includes(type)) {
      return res.status(400).json({ message: 'Invalid parameters. Specify a number and type (jours, mois, annees).' });
    }

    const periodValue = parseInt(number);

    const fromDate = new Date();
    switch (type) {
      case 'jours':
        fromDate.setDate(fromDate.getDate() - periodValue);
        break;
      case 'mois':
        fromDate.setMonth(fromDate.getMonth() - periodValue);
        break;
      case 'annees':
        fromDate.setFullYear(fromDate.getFullYear() - periodValue);
        break;
      default:
        return res.status(400).json({ message: 'Invalid type. Use jours, mois, or annees.' });
    }

    const accountsWithTransactions = await BankAccount.findAll({
      where: { user_id: userId },
      include: [{
        model: Transaction,
        as: 'transactions',
        where: fromDate ? { createdAt: { [Op.gte]: fromDate } } : {},
        required: true
      }]
    });

    const transactions = accountsWithTransactions.flatMap(account => account.transactions);

    res.status(200).json({ transactions });
  } catch (error) {
    console.log(error)
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
