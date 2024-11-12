// models/LoginHistory.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Relation avec User

const LoginHistory = sequelize.define('LoginHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loginDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

// Relation entre LoginHistory et User : un utilisateur peut avoir plusieurs connexions
User.hasMany(LoginHistory);
LoginHistory.belongsTo(User);

module.exports = LoginHistory;
