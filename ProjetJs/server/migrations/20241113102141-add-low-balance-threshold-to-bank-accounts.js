// migrations/20231102123456-add-low-balance-threshold-to-bank-accounts.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajouter la colonne 'low_balance_threshold' à la table 'BankAccounts'
    await queryInterface.addColumn('bank_accounts', 'low_balance_threshold', {
      type: Sequelize.FLOAT,
      allowNull: true,  // Cette colonne est optionnelle
      defaultValue: 0.0,  // Valeur par défaut si non spécifiée
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Si la migration est annulée, on supprime la colonne
    await queryInterface.removeColumn('bank_accounts', 'low_balance_threshold');
  },
};
