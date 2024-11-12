const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const BankAccount = require('./BankAccount');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  balance_after_transaction: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  account_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BankAccount,
      key: 'id'
    },
    allowNull: false
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

BankAccount.hasMany(Transaction, { foreignKey: 'account_id' });
Transaction.belongsTo(BankAccount, { foreignKey: 'account_id' });

module.exports = Transaction;
