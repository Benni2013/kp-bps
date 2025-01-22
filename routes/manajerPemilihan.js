const express = require('express');
const router = express.Router();

// Route untuk halaman manajemen pemilihan - GET
router.get('/', function(req, res, next) {
  res.render('admin/manajemen_pemilihan/pemilihan', { 
    title: 'Pemilihan',
    layout: 'layouts/admin.hbs',
   });
});

// Route untuk halaman buat pemilihan - GET
router.get('/buat', function(req, res, next) {
  res.render('admin/manajemen_pemilihan/buat_pemilihan', { 
    title: 'Buat Pemilihan',
    layout: 'layouts/admin.hbs',
   });
});

// Route untuk proses buat pemilihan - POST
router.post('/buat', function(req, res, next) {
  console.log('\nSebuah pemilihan baru telah dibuat.\n');
  res.redirect('/admin/manajemen_pemilihan');
});

// Route untuk tutup pemilihan - GET
router.get('/tutup', function(req, res, next) {
  console.log('\nPemilihan telah ditutup.\n');
  res.redirect('/admin/manajemen_pemilihan');
});

// Route untuk hapus pemilihan - GET
router.get('/hapus', function(req, res, next) {
  console.log('\nPemilihan telah dihapus.\n');
  res.redirect('/admin/manajemen_pemilihan');
});

module.exports = router;