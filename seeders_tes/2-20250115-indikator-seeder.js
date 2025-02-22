'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const indikatorData = [
      {
        indikator_id: 1,
        isi_indikator: 'Memahami dan memenuhi kebutuhan masyarakat',
        tipe_indikator: 'Berorientasi Pelayanan',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 2,
        isi_indikator: 'Ramah, cekatan, solutif, dan dapat diandalkan',
        tipe_indikator: 'Berorientasi Pelayanan',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 3,
        isi_indikator: 'Melakukan perbaikan tiada henti',
        tipe_indikator: 'Berorientasi Pelayanan',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 4,
        isi_indikator: 'Melaksanakan tugas dengan jujur, bertanggungjawab, cermat, disiplin dan berintegritas tinggi',
        tipe_indikator: 'Akuntabel',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 5,
        isi_indikator: 'Menggunakan kekayaan dan barang milik negara secara bertanggungjawab, efektif, dan efisien',
        tipe_indikator: 'Akuntabel',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 6,
        isi_indikator: 'Tidak menyalahgunakan kewenangan jabatan',
        tipe_indikator: 'Akuntabel',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 7,
        isi_indikator: 'Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah',
        tipe_indikator: 'Kompeten',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 8,
        isi_indikator: 'Membantu orang lain belajar',
        tipe_indikator: 'Kompeten',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 9,
        isi_indikator: 'Melaksanakan tugas dengan kualitas terbaik',
        tipe_indikator: 'Kompeten',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 10,
        isi_indikator: 'Menghargai setiap orang apapun latar belakangnya',
        tipe_indikator: 'Harmonis',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 11,
        isi_indikator: 'Suka menolong orang lain',
        tipe_indikator: 'Harmonis',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 12,
        isi_indikator: 'Membangun lingkungan kerja yang kondusif',
        tipe_indikator: 'Harmonis',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 13,
        isi_indikator: 'Memegang teguh ideologi Pancasila, Undang-Undang Dasar Negara Republik Indonesia Tahun 1945, NKRI serta pemerintahan yang sah',
        tipe_indikator: 'Loyal',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 14,
        isi_indikator: 'Menjaga nama baik sesama ASN, Pimpinan, Instansi, dan negara',
        tipe_indikator: 'Loyal',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 15,
        isi_indikator: 'Menjaga rahasia jabatan dan negara',
        tipe_indikator: 'Loyal',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 16,
        isi_indikator: 'Cepat menyesuaikan diri menghadapi perubahan',
        tipe_indikator: 'Adaptif',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 17,
        isi_indikator: 'Terus berinovasi untuk mengembangkan kreativitas',
        tipe_indikator: 'Adaptif',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 18,
        isi_indikator: 'Bertindak proaktif',
        tipe_indikator: 'Adaptif',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 19,
        isi_indikator: 'Memberikan kesempatan kepada berbagai pihak untuk berkontribusi',
        tipe_indikator: 'Kolaboratif',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 20,
        isi_indikator: 'Terbuka dalam bekerja sama untuk menghasilkan nilai tambah',
        tipe_indikator: 'Kolaboratif',
        status_inditakor: 'aktif'
      },
      {
        indikator_id: 21,
        isi_indikator: 'Menggerakan pemanfaatan berbagai sumber daya untuk tujuan bersama',
        tipe_indikator: 'Kolaboratif',
        status_inditakor: 'aktif'
      }
    ];

    await queryInterface.bulkInsert('indikator', indikatorData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('indikator', null, {});
  }
};