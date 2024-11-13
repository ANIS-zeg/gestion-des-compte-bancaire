const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const BankAccount = require('./BankAccount');
const User = require('./User'); // Assure-toi que le modèle User est bien importé

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
    allowNull: true
  },
  account_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BankAccount,
      key: 'id'
    },
    allowNull: true
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
  tableName: 'notifications',
  timestamps: true
});

// Configurations des associations
BankAccount.hasOne(Notification, { foreignKey: 'account_id' });
Notification.belongsTo(BankAccount, { foreignKey: 'account_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Notification;
