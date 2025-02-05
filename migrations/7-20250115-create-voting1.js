// migrations/XXXXXX-create-voting1.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('voting1', {
      voting1_id: {
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
      pilihan1: {
        type: Sequelize.STRING(50),
        references: {
          model: 'anggota',
          key: 'nip'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pilihan2: {
        type: Sequelize.STRING(50),
        references: {
          model: 'anggota',
          key: 'nip'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pilihan3: {
        type: Sequelize.STRING(50),
        references: {
          model: 'anggota',
          key: 'nip'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      skor_pil1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      skor_pil2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      skor_pil3: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_skor: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      waktu_vot1: {
        type: Sequelize.DATE
      },
      status_anggota: {
        type: Sequelize.ENUM('lolos', 'gugur'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('voting1');
  }
};