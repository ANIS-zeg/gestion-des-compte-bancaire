// models/Notification.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Relation avec User

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Notification non lue par défaut
  },
  type: {
    type: DataTypes.STRING, // Par exemple : "Solde Bas"
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

// Relation entre User et Notification : un utilisateur peut avoir plusieurs notifications
User.hasMany(Notification);
Notification.belongsTo(User);

module.exports = Notification;
