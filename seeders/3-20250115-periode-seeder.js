// seeders/XXXXXX-demo-periode.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('periode', [
      {
        nama_periode: 'Triwulan 1'
      },
      {
        nama_periode: 'Triwulan 2'
      },
      {
        nama_periode: 'Triwulan 3'
      },
      {
        nama_periode: 'Triwulan 4'
      },
      {
        nama_periode: 'Semester 1'
      },
      {
        nama_periode: 'Semester 2'
      },
      {
        nama_periode: 'Tahunan'
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('periode', null, {});
  }
};