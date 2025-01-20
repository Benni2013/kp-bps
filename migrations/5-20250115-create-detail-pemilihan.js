// migrations/XXXXXX-create-detail-pemilihan.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('detail_pemilihan', {
      detail_pemilihan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      pemilihan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pemilihan',
          key: 'pemilihan_id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE'
      },
      anggota_id: {
        type: Sequelize.STRING(50),
        references: {
          model: 'anggota',
          key: 'nip'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('detail_pemilihan');
  }
};