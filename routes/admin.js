var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { 
    title: 'Dashboard Admin',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota', { 
    title: 'Manajemen Anggota',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_pemilihan', function(req, res, next) {
  res.render('admin/manajemen_pemilihan', { 
    title: 'Manajemen Pemilihan',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_pemilihan/pemilihan', function(req, res, next) {
  res.render('admin/pemilihan', { 
    title: 'Pemilihan',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_pemilihan/pemilihan-berlangsung', function(req, res, next) {
  res.render('admin/pemilihan_berlangsung', { 
    title: 'Pemilihan Berlangsung',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_pemilihan/buat', function(req, res, next) {
  res.render('admin/buat_pemilihan', { 
    title: 'Buat Pemilihan',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_pemilihan/input-penilaian', function(req, res, next) {
  res.render('admin/input_penilaian', { 
    title: 'Input Penilaian',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_pemilihan/hasil_penilaian', function (req, res, next) {
  res.render('admin/hasil_penilaian', { 
    title: 'Hasil Penilaian',
    layout: 'layouts/admin.hbs',
   });
});

router.get('/manajemen_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria', { 
    title: 'Manajemen Kriteria',
    layout: 'layouts/admin.hbs',
   });
});

// router.get('/riwayat_pemilihan', function(req, res, next) {
//   res.render('admin/riwayat_pemilihan', { 
//     title: 'Riwayat Pemilihan',
//     layout: 'layouts/admin.hbs',
//    });
// });

// data untuk monitor voting 1
const voting1Status = {
  isVotingOpen: true,
  totalPemilih: 34,
  sudahVote: 20,
  belumVote: 4,
  progressPercentage: 80,
};

// Route untuk monitor voting 1
router.get('/monitor_voting1', function(req, res, next) {
  // votingStatus.isVotingOpen = true;
  const anggota = [
      { no: 1, nama: "Frizqya Dela Pratiwi", sudahVote: true, waktu: "2024-01-15 09:30",
      },
      { no: 2, nama: "Annisa Nurul Hakim", sudahVote: true, waktu: "2024-01-15 10:45",
      },
      { no: 3, nama: "Muhammad Raihan Alghifari", sudahVote: false, waktu: "-",
      },
  ];
  const hasilVoting = [
    { nama: "Frizqya Dela Pratiwi", votes: 20, percentage: 60,
    },
    { nama: "Annisa Nurul Hakim", votes: 8, percentage: 24,
    },
    { nama: "Muhammad Raihan Alghifari", votes: 5, percentage: 16,
    },
  ];

  res.render('admin/monitor_voting1', { 
    title: 'Monitor Voting 1',
    layout: 'layouts/admin.hbs',
    anggota: anggota,
    votingStatus: voting1Status,
    hasilVoting: hasilVoting,
   });
});

// Route untuk menghandle tutup voting 1
router.post('/tutup_voting1', (req, res) => {
  voting1Status.isVotingOpen = false;
  res.json({ success: true, message: 'Voting berhasil ditutup', });
});

// Route untuk kandidat penilaian keriteria
router.get('/kandidat_penilaian_kriteria', function(req, res, next) {
  // Data dummy untuk kandidat
  const kandidatData = [
    { no: 1, nama: "Frizqya Dela Pratiwi", skor1: 45, skor2: 45, skor3: 45, total: 100, },
    { no: 2, nama: "Annisa Nurul Hakim", skor1: 15, skor2: 15, skor3: 15, total: 99, },
    { no: 3, nama: "Muhammad Raihan Alghifari", skor1: 15, skor2: 15, skor3: 15, total: 99, },
    { no: 4, nama: "Benni Putra Chaniago", skor1: 3, skor2: 3, skor3: 3, total: 98, },
    { no: 5, nama: "Faiz Hadyan", skor1: 3, skor2: 3, skor3: 3, total: 98, },
  ];

  res.render('admin/kandidat_penilaian_kriteria', { 
    title: 'Kandidat Penilaian Kriteria',
    layout: 'layouts/admin.hbs',
    kandidat: kandidatData,
   });
});

// data untuk monitor voting 2
const voting2Status = {
  isVotingOpen: true,
  totalPengisi: 34,
  sudahIsi: 20,
  belumIsi: 4,
  progressPercentage: 80,
};

// Route untuk monitor voting 2
router.get('/penilaian_kriteria', function(req, res, next) {
  // voting2Status.isVotingOpen = true;
  // Data dummy untuk anggota
  const anggota = [
      { no: 1, nama: "Frizqya Dela Pratiwi", sudahMengisi: true, waktu: "2024-01-15 09:30", },
      { no: 2, nama: "Annisa Nurul Hakim", sudahMengisi: true, waktu: "2024-01-15 10:45", },
      { no: 3, nama: "Muhammad Raihan Alghifari", sudahMengisi: false, waktu: "-", },
  ];

  res.render('admin/monitor_voting2', { 
    title: 'Monitor Voting 2',
    layout: 'layouts/admin.hbs',
    anggota: anggota,
    votingStatus: voting2Status,
   });
});

// Route untuk menghandle tutup voting 2
router.post('/tutup_voting2', (req, res) => {
  voting2Status.isVotingOpen = false;
  res.json({ success: true, message: 'Penilaian Kriteria berhasil ditutup', });
});

// Route untuk riwayat pemilihan
router.get('/riwayat_pemilihan', function(req, res, next) {
  // Data dummy untuk riwayat pemilihan
  const riwayatData = [
    {
        id: 1,
        judul: "Pemilihan Pegawai Terbaik Triwulan 1 Tahun 2024",
        tanggal: "15 Jan 2024",
        pemenang: "Frizqya Dela Pratiwi",
        posisi: 1,
    },
    {
        id: 2,
        judul: "Pemilihan Pegawai Terbaik Triwulan 4 Tahun 2023",
        tanggal: "15 Dec 2023",
        pemenang: "Annisa Nurul Hakim",
        posisi: 1,
    },
    {
        id: 3,
        judul: "Pemilihan Pegawai Terbaik Triwulan 3 Tahun 2023",
        tanggal: "15 Sep 2023",
        pemenang: "Muhammad Raihan Alghifari",
        posisi: 1,
    }
  ];

  res.render('admin/riwayat_pemilihan', {
    title: 'Riwayat Pemilihan',
    layout: 'layouts/admin.hbs',
    riwayatData: riwayatData,
    });
});

// Route untuk detail riwayat pemilihan
router.get('/riwayat_pemilihan/detail/:id', function(req, res, next) {
  // Data dummy untuk detail riwayat pemilihan
  const riwayatDetailData = [
    { id: 1, nama: "Frizqya Dela Pratiwi", nip: "192312345678900", posisi: 1, jmlPoin: 2520, rata2: 90.91, },
    { id: 2, nama: "Annisa Nurul Hakim", nip: "192312345678900", posisi: 2, jmlPoin: 2462, rata2: 88.82, },
    { id: 3, nama: "Muhammad Raihan Alghifari", nip: "192312345678900", posisi: 3, jmlPoin: 2442, rata2: 80.10, },
  ];

  const judul = "PEMILIHAN PEGAWAI TELADAN";
  const periode = "Triwulan 1";
  const tahun = 2024;

  res.render('admin/detail_riwayat_pemilihan', {
    title: 'Detail Riwayat Pemilihan',
    layout: 'layouts/admin.hbs',
    judul,
    periode,
    tahun,
    riwayatDetailData: riwayatDetailData,
    });
});

// Route untuk download laporan
router.get('/download_hasil', (req, res) => {
  // Implementasi download laporan bisa ditambahkan di sini
  res.send('Download functionality to be implemented');
});


module.exports = router;
