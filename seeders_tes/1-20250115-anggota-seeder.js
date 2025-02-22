'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate default password hash
    const defaultPassword = await bcrypt.hash('1234', 10);
    
    const anggotaData = [
      {
        nip: '050061116',
        nama: 'agif',
        email: 'agif@example.com',
        password: await bcrypt.hash('agif', 10), 
        role: 'biasa',
        jabatan: 'Pengolah Data',
        divisi: 'Inti',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      },
      {
        nip: '340013515',
        nama: 'ul Nur',
        email: 'ulnur@example.com',
        password: defaultPassword,
        role: 'biasa',
        jabatan: 'Statistisi Ahli Muda',
        divisi: 'Inti',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      },
      {
        nip: '340014375',
        nama: 'satria Noa',
        email: 'satrianoa@example.com',
        password: defaultPassword,
        role: 'biasa',
        jabatan: 'Pengolah Data',
        divisi: 'Inti',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      },
      {
        nip: '340015616',
        nama: 'Emir',
        email: 'Emir@example.com',
        password: defaultPassword,
        role: 'biasa',
        jabatan: 'Statistisi Ahli Muda',
        divisi: 'Inti',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      },
      {
        nip: '340015808',
        nama: 'Riskan',
        email: 'Riskan@example.com',
        password: defaultPassword,
        role: 'supervisor',
        jabatan: 'Kepala BPS Kabupaten/Kota',
        divisi: 'Inti',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      },
      {
        nip: '101010',
        nama: 'Admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin', 10),
        role: 'admin',
        jabatan: 'Admin WEB E-Voisy',
        divisi: 'Admin Web',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      }
    ];

    await queryInterface.bulkInsert('anggota', anggotaData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('anggota', null, {});
  }
};