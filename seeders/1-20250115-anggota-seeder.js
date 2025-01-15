'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate default password hash
    const defaultPassword = await bcrypt.hash('1234', 10);
    
    const anggotaData = [
      {
        nip: '050061116',
        nama: 'Yusuf',
        email: 'yusuf@example.com',
        password: defaultPassword,
        role: 'biasa',
        jabatan: 'Pengolah Data',
        status_anggota: 'aktif'
      },
      {
        nip: '340013515',
        nama: 'Ahmad Nur',
        email: 'ahmadnur@example.com',
        password: defaultPassword,
        role: 'biasa',
        jabatan: 'Statistisi Ahli Muda',
        status_anggota: 'aktif'
      },
      {
        nip: '340014375',
        nama: 'Yatria Nova',
        email: 'yatrianova@example.com',
        password: defaultPassword,
        role: 'biasa',
        jabatan: 'Pengolah Data',
        status_anggota: 'aktif'
      },
      {
        nip: '340015616',
        nama: 'Edy',
        email: 'edy@example.com',
        password: defaultPassword,
        role: 'biasa',
        jabatan: 'Statistisi Ahli Muda',
        status_anggota: 'aktif'
      },
      {
        nip: '340015808',
        nama: 'Alfianto',
        email: 'alfianto@example.com',
        password: defaultPassword,
        role: 'supervisor',
        jabatan: 'Kepala BPS Kabupaten/Kota',
        status_anggota: 'aktif'
      }
    ];

    await queryInterface.bulkInsert('anggota', anggotaData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('anggota', null, {});
  }
};