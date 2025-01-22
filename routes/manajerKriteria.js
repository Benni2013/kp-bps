const express = require('express');
const router = express.Router();

// Route untuk halaman manajemen kriteria - GET
router.get('/', function(req, res, next) {
  // data kriteria dummy yg berisi 3 kriteria dg properti id, isi_kriteria, dan kategori
  const dataKriteria = [
    { id: 1, isi_kriteria: 'Memahami dan memenuhi kebutuhan masyarakat', kategori:'Berorientasi Pelayanan', status: true },
    { id: 2, isi_kriteria: 'Kriteria 2', kategori:'Akuntabel', status: true },
  ];

  res.render('admin/manajemen_kriteria/manajemen_kriteria', {  
    title: 'Manajemen Kriteria',
    layout: 'layouts/admin.hbs', 
    dataKriteria: dataKriteria,
  });
});

// Route untuk halaman tambah kriteria - GET
router.get('/tambah_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria/tambah_kriteria', { 
    title: 'Tambah Kriteria',
    layout: 'layouts/admin.hbs', 
  });
});

// Route untuk proses tambah kriteria - POST
router.post('/tambah_kriteria', function(req, res, next) {
  console.log('\nKriteria baru ditambahkan\n');
  res.redirect('/admin/manajemen_kriteria');
});

// Route untuk halaman edit kriteria - GET
router.get('/edit_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria/edit_kriteria', { 
    title: 'Edit Kriteria',
    layout: 'layouts/admin.hbs', 
  });
});

// Route untuk proses edit kriteria - POST
router.post('/edit_kriteria', function(req, res, next) {
  console.log('\nKriteria berhasil diedit\n');
  res.redirect('/admin/manajemen_kriteria');
});


// Route untuk hapus kriteria - GET
router.get('/hapus_kriteria', function(req, res, next) {
  console.log('\nKriteria berhasil dihapus\n');
  res.redirect('/admin/manajemen_kriteria');
});


module.exports = router;