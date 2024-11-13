'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajout de la colonne avec `allowNull: true` pour éviter les erreurs pendant la migration
    await queryInterface.addColumn('notifications', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Remplace `1` par un `id` valide de la table `users` ou une requête pour un utilisateur existant
    await queryInterface.sequelize.query(`
      UPDATE notifications SET user_id = 1 WHERE user_id IS NULL
    `);

    // Appliquer la contrainte `allowNull: false`
    await queryInterface.changeColumn('notifications', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notifications', 'user_id');
  }
};
