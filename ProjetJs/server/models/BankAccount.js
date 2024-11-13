const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const BankAccount = sequelize.define('BankAccount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL,
    defaultValue: 0.0
  },
  low_balance_threshold: {
    type: DataTypes.DECIMAL,
    allowNull: true, 
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  }
}, {
  tableName: 'bank_accounts',
  timestamps: true
});

User.hasMany(BankAccount, { foreignKey: 'user_id' });
BankAccount.belongsTo(User, { foreignKey: 'user_id' });

module.exports = BankAccount;
