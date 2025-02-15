// migrations/XXXXXX-create-pemilihan.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pemilihan', {
      pemilihan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      nama_pemilihan: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      periode_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'periode',
          key: 'periode_id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      tahun: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tanggal_mulai: {
        type: Sequelize.DATE,
        allowNull: false
      },
      tahap_pemilihan: {
        type: Sequelize.ENUM('datanilai', 'voting1',  'voting2', 'tutup', 'selesai'),
        allowNull: false,
        defaultValue: 'datanilai'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pemilihan');
  }
};