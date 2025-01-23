const express = require('express');
const router = express.Router();

const manajerAnggotaRouter = require('./manajerAnggota');
const manajerKriteriaRouter = require('./manajerKriteria');
const manajerPemilihanRouter = require('./manajerPemilihan');
const pemilihanBerlangsungRouter = require('./pemilihanBerlangsung');
const generateRouter = require('./generate');

// Route untuk dashboard admin - GET
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { 
    title: 'Dashboard Admin',
    layout: 'layouts/admin.hbs',
   });
});

// Route untuk manajemen anggota - USE
router.use('/manajemen_anggota', manajerAnggotaRouter);

// Route untuk manajemen kriteria - USE
router.use('/manajemen_kriteria', manajerKriteriaRouter);

// Route untuk manajemen pemilihan - USE
router.use('/manajemen_pemilihan', manajerPemilihanRouter);

// Route untuk pemilihan berlangsung - USE
router.use('/pemilihan_berlangsung', pemilihanBerlangsungRouter);

// Router untuk generate file-file - USE
router.use('/generate', generateRouter);

// Route untuk halaman riwayat pemilihan - GET
router.get('/riwayat_pemilihan', function(req, res, next) {
  res.render('admin/riwayat_pemilihan/riwayat_pemilihan', { 
    title: 'Riwayat Pemilihan',
    layout: 'layouts/admin.hbs',
   });
});

// Route untuk halaman detail riwayat pemilihan - GET
router.get('/detail_riwayat', function(req, res, next) {
  res.render('admin/riwayat_pemilihan/detail_riwayat', { 
    title: 'Detail Riwayat Pemilihan',
    layout: 'layouts/admin.hbs',
   });
});



// Route untuk riwayat pemilihan
// router.get('/riwayat_pemilihan', function(req, res, next) {
//   // Data dummy untuk riwayat pemilihan
//   const riwayatData = [
//     {
//         id: 1,
//         judul: "Pemilihan Pegawai Terbaik Triwulan 1 Tahun 2024",
//         tanggal: "15 Jan 2024",
//         pemenang: "Frizqya Dela Pratiwi",
//         posisi: 1,
//     },
//     {
//         id: 2,
//         judul: "Pemilihan Pegawai Terbaik Triwulan 4 Tahun 2023",
//         tanggal: "15 Dec 2023",
//         pemenang: "Annisa Nurul Hakim",
//         posisi: 1,
//     },
//     {
//         id: 3,
//         judul: "Pemilihan Pegawai Terbaik Triwulan 3 Tahun 2023",
//         tanggal: "15 Sep 2023",
//         pemenang: "Muhammad Raihan Alghifari",
//         posisi: 1,
//     }
//   ];

//   res.render('admin/riwayat_pemilihan', {
//     title: 'Riwayat Pemilihan',
//     layout: 'layouts/admin.hbs',
//     riwayatData: riwayatData,
//     });
// });

// Route untuk detail riwayat pemilihan
// router.get('/riwayat_pemilihan/detail/:id', function(req, res, next) {
//   // Data dummy untuk detail riwayat pemilihan
//   const riwayatDetailData = [
//     { id: 1, nama: "Frizqya Dela Pratiwi", nip: "192312345678900", posisi: 1, jmlPoin: 2520, rata2: 90.91, },
//     { id: 2, nama: "Annisa Nurul Hakim", nip: "192312345678900", posisi: 2, jmlPoin: 2462, rata2: 88.82, },
//     { id: 3, nama: "Muhammad Raihan Alghifari", nip: "192312345678900", posisi: 3, jmlPoin: 2442, rata2: 80.10, },
//   ];

//   const judul = "PEMILIHAN PEGAWAI TELADAN";
//   const periode = "Triwulan 1";
//   const tahun = 2024;

//   res.render('admin/detail_riwayat_pemilihan', {
//     title: 'Detail Riwayat Pemilihan',
//     layout: 'layouts/admin.hbs',
//     judul,
//     periode,
//     tahun,
//     riwayatDetailData: riwayatDetailData,
//     });
// });


module.exports = router;
