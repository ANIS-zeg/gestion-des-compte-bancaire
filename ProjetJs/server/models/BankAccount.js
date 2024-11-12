// models/BankAccount.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Relation avec User

const BankAccount = sequelize.define('BankAccount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'current', // Par défaut "compte courant"
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0, // Solde initial du compte
  },
});

// Relation entre User et BankAccount : un utilisateur peut avoir plusieurs comptes bancaires
User.hasMany(BankAccount);
BankAccount.belongsTo(User);

module.exports = BankAccount;
