// migrations/XXXXXX-create-anggota.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('anggota', {
      nip: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      nama: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('biasa', 'supervisor', 'admin'),
        allowNull: false,
        defaultValue: 'biasa'
      },
      gender: {
        type: Sequelize.ENUM('pria', 'wanita')
      },
      divisi: {
        type: Sequelize.STRING(100)
      },
      jabatan: {
        type: Sequelize.STRING(255)
      },
      foto: {
        type: Sequelize.STRING(500)
      },
      status_anggota: {   // untuk status eligible voters
        type: Sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: true,
        defaultValue: 'aktif',
      },
      status_karyawan: {  // untuk status karyawan
        type: Sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('anggota');
  }
};