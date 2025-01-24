const express = require('express');
const router = express.Router();

const pemilihanRouter = require('./pemilihan');
const generateRouter = require('./generate');

const { middlewareValidation } = require('../controllers/AuthController');

// Route untuk halaman beranda - GET
router.get('/beranda', middlewareValidation, function (req, res, next) {
  // dummy data
  let pegawaiTerbaik = true;

  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');
  
  res.render('user/beranda', { 
    title: 'Beranda',
    pegawaiTerbaik: pegawaiTerbaik,
    layout: 'layouts/layout',
    role,
   });
});

// Route untuk halaman Dashboard (SUPERVISOR) - GET
router.get('/dashboard', middlewareValidation, function (req, res, next) {

  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');

  res.render('supervisor/dashboard', { 
    title: 'Dashboard', 
    layout: 'layouts/layout',
    role,
   });
});

// Router untuk pemilihan - USE
router.use('/pemilihan', pemilihanRouter);

// Router untuk generate - USE
router.use('/generate', generateRouter);

// Route untuk halaman riwayat - GET
router.get('/riwayat', function (req, res, next) {
  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');

  res.render('user/riwayat', { 
    title: 'Riwayat Pemilihan',
    layout: 'layouts/layout', 
    role,
  });
});

// Route untuk halaman profil - GET
router.get('/profil', function(req, res, next) {
  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');

  res.render('supervisor/profil', { 
    title: 'Profil',
    layout: "layouts/profile", 
    role,
  });
});

module.exports = router;
