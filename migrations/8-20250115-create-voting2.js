// migrations/XXXXXX-create-voting2.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('voting2', {
      voting2_id: {
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
      indikator_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'indikator',
          key: 'indikator_id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'SET NULL'
      },
      kandidat_id: {
        type: Sequelize.STRING(50),
        references: {
          model: 'anggota',
          key: 'nip'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      nilai: {
        type: Sequelize.INTEGER
      },
      waktu_vot2: {
        type: Sequelize.DATE
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('voting2');
  }
};