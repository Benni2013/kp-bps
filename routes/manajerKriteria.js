const express = require('express');
const router = express.Router();

const { getAllKriteria, getOneKriteria, editKriteria, createKriteria, deleteKriteria } = require('../controllers/ManajerKriteria');

// Route untuk halaman manajemen kriteria - GET
router.get('/', getAllKriteria);

// Route untuk halaman tambah kriteria - GET
router.get('/tambah_kriteria', function(req, res, next) {

  res.render('admin/manajemen_kriteria/tambah_kriteria', { 
    title: 'Tambah Kriteria',
    layout: 'layouts/admin.hbs', 
    akun: req.user,
  });
});

// Route untuk proses tambah kriteria - POST
router.post('/tambah_kriteria', createKriteria);

// Route untuk halaman edit kriteria - GET
router.get('/edit_kriteria/:id', getOneKriteria);

// Route untuk proses edit kriteria - POST
router.post('/edit_kriteria/:id', editKriteria);


// Route untuk hapus kriteria - POST
router.post('/hapus_kriteria', deleteKriteria);


module.exports = router;