// migrations/XXXXXX-create-data-nilai.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data_nilai', {
      data_nilai_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      detail_pemilihan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'detail_pemilihan',
          key: 'detail_pemilihan_id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE'
      },
      score_ckp: {
        type: Sequelize.FLOAT,
        defaultValue: 0.00
      },
      score_absen: {
        type: Sequelize.FLOAT,
        defaultValue: 0.00
      },
      score_akhir: {
        type: Sequelize.FLOAT,
        defaultValue: 0.00
      },
      status_anggota: {
        type: Sequelize.ENUM('non_eligible', 'eligible')
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('data_nilai');
  }
};