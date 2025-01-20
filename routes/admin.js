var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Express' });
});

router.get('/manajemen_anggota', function(req, res, next) {
  res.render('admin/manajemenAnggota/manajemen_anggota', { title: 'Express' });
});

router.get('/tambah_anggota', function(req, res, next) {
  res.render('admin/manajemenAnggota/tambah_anggota', { title: 'Express' });
});

router.get('/detail_anggota', function(req, res, next) {
  res.render('admin/manajemenAnggota/detail_anggota', { title: 'Express' });
});

router.get('/edit_anggota', function(req, res, next) {
  res.render('admin/manajemenAnggota/edit_anggota', { title: 'Express' });
});

router.get('/ubahpw_anggota', function(req, res, next) {
  res.render('admin/manajemenAnggota/ubahpw_anggota', { title: 'Express' });
});

router.get('/manajemen_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria', { title: 'Express' });
});


module.exports = router;
