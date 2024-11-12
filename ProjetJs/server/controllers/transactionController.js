const Transaction = require('../models/Transaction');
const BankAccount = require('../models/BankAccount');
const User = require('../models/User')
const { Op } = require('sequelize');

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

    // const transactions = await Transaction.findAll({
    //   where: {
    //     createdAt: {
    //       [Op.gte]: fromDate
    //     }
    //   },
    //   order: [['createdAt', 'DESC']]
    // });

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
