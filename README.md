# Gestion de Comptes et Transactions Bancaires en Ligne

Ce projet est une application de gestion de comptes bancaires et de transactions, développée en **Node.js**. Elle offre des fonctionnalités complètes pour les utilisateurs, telles que la création de comptes bancaires, l'ajout de transactions, la visualisation de l'historique, et bien plus encore.

## ⚙️ Installation et Configuration

### Prérequis
- **Node.js**
- **MySQL** (Serveur de base de données)

### Étapes d'installation et lancement de l'application

1. **Clonez le dépôt**
   ```bash
   git clone https://github.com/ANIS-zeg/gestion-des-compte-bancaire.git
   cd gestion-des-comptes-bancaires/ProjetJs/server
   ```

2. **Installez les dépendances**
   ```bash
   npm install
    bcrypt
    cors
    csv-writer
    dotenv
    express
    jsonwebtoken
    mysql2
    nodemon
    sequelize

   ```

3. **Initialisez la base de données**
   Exécutez la commande suivante pour créer les tables nécessaires dans la base de données :
   ```bash
   npx sequelize-cli db:migrate
   ```

4. **Lancez l'application**
   ```bash
    cd gestion-des-comptes-bancaires/ProjetJs/server
    node server.js
   ```

5. **Accédez à l'application**
   Ouvrez votre navigateur et accédez à [http://127.0.0.1:5500/ProjetJs/client/homePage.html].
---


## 👥 Équipe de Développement

- **Développeur 1** : OUCHENNI Mohamed
- **Développeur 2** : ZEGHLOUCHE ANIS
- **Développeur 3** : BOUREMANE Mohamed Elyes

---
