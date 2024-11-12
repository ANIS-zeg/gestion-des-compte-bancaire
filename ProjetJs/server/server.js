// server.js
const express = require('express');
const sequelize = require('./config/database'); // Import de la configuration de la base de données
const app = express();
const PORT = 3000;

// Synchronisation de la base de données pour créer les tables
sequelize.sync({ force: false }) // force: true recrée les tables à chaque exécution
  .then(() => {
    console.log('La base de données est synchronisée.');
  })
  .catch(error => {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
  });

// Configuration des middlewares et routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exemple de route pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur bancaire en ligne !');
});

// Lancer le serveur sur localhost
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
