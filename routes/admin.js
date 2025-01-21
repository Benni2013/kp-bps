var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Express' });
});

router.get('/manajemen_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/manajemen_anggota', { title: 'Express' });
});

router.get('/tambah_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/tambah_anggota', { title: 'Express' });
});

router.get('/detail_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/detail_anggota', { title: 'Express' });
});

router.get('/edit_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/edit_anggota', { title: 'Express' });
});

router.get('/ubahpw_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/ubahpw_anggota', { title: 'Express' });
});

router.get('/manajemen_pemilihan', function(req, res, next) {
  res.render('admin/manajemen_pemilihan', { title: 'Manajemen Pemilihan' });
});

router.get('/manajemen_pemilihan/pemilihan', function(req, res, next) {
  res.render('admin/pemilihan', { title: 'Pemilihan' });
});

router.get('/manajemen_pemilihan/pemilihan-berlangsung', function(req, res, next) {
  res.render('admin/pemilihan_berlangsung', { title: 'Pemilihan Berlangsung' });
});

router.get('/manajemen_pemilihan/buat', function(req, res, next) {
  res.render('admin/buat_pemilihan', { title: 'Buat Pemilihan' });
});

router.get('/manajemen_pemilihan/input-penilaian', function(req, res, next) {
  res.render('admin/input_penilaian', { title: 'Input Penilaian' });
});

router.get('/manajemen_pemilihan/hasil_penilaian', function (req, res, next) {
  res.render('admin/hasil_penilaian', { title: 'Hasil Penilaian' });
});

router.get('/manajemen_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria/manajemen_kriteria', { title: 'Express' });
});

router.get('/tambah_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria/tambah_kriteria', { title: 'Express' });
});

router.get('/edit_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria/edit_kriteria', { title: 'Express' });
});

router.get('/riwayat_pemilihan', function(req, res, next) {
  res.render('admin/riwayat_pemilihan/riwayat_pemilihan', { title: 'Express' });
});

router.get('/detail_riwayat', function(req, res, next) {
  res.render('admin/riwayat_pemilihan/detail_riwayat', { title: 'Express' });
});

router.get('/riwayat_pemilihan', function(req, res, next) {
  res.render('admin/riwayat_pemilihan', { title: 'Express' });
});

module.exports = router;
