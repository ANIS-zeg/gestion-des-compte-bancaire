const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const LoginHistory = sequelize.define('LoginHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: 'login_histories',
  timestamps: true
});

User.hasMany(LoginHistory, { foreignKey: 'user_id' });
LoginHistory.belongsTo(User, { foreignKey: 'user_id' });

module.exports = LoginHistory;
