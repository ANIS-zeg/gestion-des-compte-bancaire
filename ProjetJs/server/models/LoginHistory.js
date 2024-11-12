// models/LoginHistory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const LoginHistory = sequelize.define('LoginHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  loginDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  }
}, {
  tableName: 'login_histories',
  timestamps: true
});

User.hasMany(LoginHistory, { foreignKey: 'userId' });
LoginHistory.belongsTo(User, { foreignKey: 'userId' });

module.exports = LoginHistory;
