const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const BankAccount = require('./BankAccount');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  threshold: {
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
  tableName: 'notifications',
  timestamps: true
});

BankAccount.hasOne(Notification, { foreignKey: 'account_id' });
Notification.belongsTo(BankAccount, { foreignKey: 'account_id' });

module.exports = Notification;
