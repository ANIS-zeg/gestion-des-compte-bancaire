// models/Transaction.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const BankAccount = require('./BankAccount');  // Relation avec BankAccount

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // "deposit" ou "withdrawal"
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW, // Date de la transaction
  },
  balanceAfter: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Relation entre Transaction et BankAccount : une transaction appartient à un compte
BankAccount.hasMany(Transaction);
Transaction.belongsTo(BankAccount);

module.exports = Transaction;
