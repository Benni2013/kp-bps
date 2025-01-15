// migrations/XXXXXX-create-indikator.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('indikator', {
      indikator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      isi_indikator: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      tipe_indikator: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status_inditakor: {
        type: Sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('indikator');
  }
};