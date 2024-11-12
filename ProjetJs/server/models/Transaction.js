const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const BankAccount = require('./BankAccount');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  balanceAfter: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

BankAccount.hasMany(Transaction);
Transaction.belongsTo(BankAccount);

module.exports = Transaction;
