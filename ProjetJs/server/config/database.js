// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bank', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch((error) => {
    console.error('Impossible de se connecter à la base de données :', error);
  });

module.exports = sequelize;
