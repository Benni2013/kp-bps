const express = require('express');
const router = express.Router();

// Router untuk halaman manajemen anggota - GET
router.get('/', function(req, res, next) {
  // data anggota dummy yg berisi nama, nip, jabatan, tim, dan status
  const dataAnggota = [
    { nama: 'Anggota 1', nip: '123456', jabatan: 'Asisten Statistisi Terampil', tim: 'Tim A', status: true },
    { nama: 'Anggota 2', nip: '234567', jabatan: 'Pranata Keuangan APBN  Terampil', tim: 'Tim B', status: false },
  ];
  
  res.render('admin/manajemen_anggota/manajemen_anggota', { 
    title: 'Manajemen Anggota',
    layout: 'layouts/admin.hbs',
    dataAnggota: dataAnggota,
   });
});

// Router untuk halaman tambah anggota - GET
router.get('/tambah_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/tambah_anggota', { 
    title: 'Tambah Anggota',
    layout: 'layouts/admin.hbs', 
  });
});

// Router untuk proses tambah anggota - POST
router.post('/tambah_anggota', function(req, res, next) {
  console.log('\nAnggota Baru berhasil ditambahkan \n');
  res.redirect('/admin/manajemen_anggota');
});

// Router untuk halaman detail anggota - GET
router.get('/detail_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/detail_anggota', { 
    title: 'Detail Anggota',
    layout: 'layouts/admin.hbs', 
  });
});

// Router untuk halaman edit anggota - GET
router.get('/edit_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/edit_anggota', { 
    title: 'Edit Anggota',
    layout: 'layouts/admin.hbs', 
  });
});

// Router untuk proses edit anggota - POST
router.post('/edit_anggota', function(req, res, next) {
  console.log('\nAnggota berhasil diedit \n');
  res.redirect('/admin/manajemen_anggota');
});


// Router untuk halaman ubah password anggota - GET
router.get('/ubahpw_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/ubahpw_anggota', { 
    title: 'Ubah Password Anggota',
    layout: 'layouts/admin.hbs',
   });
});

// Router untuk proses ubah password anggota - POST
router.post('/ubahpw_anggota', function(req, res, next) {
  console.log('\nPassword anggota berhasil diubah \n');
  res.redirect('/admin/manajemen_anggota');
});

// Router untuk proses hapus anggota - GET
router.get('/hapus_anggota', function(req, res, next) {
  console.log('\nAnggota berhasil dihapus \n');
  res.redirect('/admin/manajemen_anggota');
});


module.exports = router;