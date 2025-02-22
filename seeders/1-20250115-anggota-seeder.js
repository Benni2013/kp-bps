'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const anggotaData = [
      {
        nip: '101010',
        nama: 'Admin',
        email: 'admin_evoisy@example.com',
        password: await bcrypt.hash('admin', 10),
        role: 'admin',
        jabatan: 'Admin WEB E-Voisy',
        divisi: 'Admin WEB',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      },
      
      
    ];

    await queryInterface.bulkInsert('anggota', anggotaData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('anggota', null, {});
  }
};