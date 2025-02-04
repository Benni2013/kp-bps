const express = require('express');
const router = express.Router();

const pemilihanRouter = require('./pemilihan');
const generateRouter = require('./generate');

const { middlewareValidation, isSupervisor } = require('../controllers/AuthController');

// Route untuk halaman beranda - GET
router.get('/beranda', middlewareValidation, function (req, res, next) {
  // dummy data
  let pegawaiTerbaik = true;

  // buat ambil role dari cookie
  let role = req.cookies.role;

  const akun = req.user;
  
  res.render('user/beranda', { 
    title: 'Beranda',
    pegawaiTerbaik: pegawaiTerbaik,
    layout: 'layouts/layout',
    role,
    akun,
   });
});

// Route untuk halaman Dashboard (SUPERVISOR) - GET
router.get('/dashboard', middlewareValidation, isSupervisor, function (req, res, next) {

  // buat ambil role dari cookie
  let role = req.cookies.role;

  const akun = req.user;

  res.render('supervisor/dashboard', { 
    title: 'Dashboard', 
    layout: 'layouts/layout',
    role,
    akun,
   });
});

// Router untuk pemilihan - USE
router.use('/pemilihan', middlewareValidation, pemilihanRouter);

// Router untuk generate - USE
router.use('/generate', middlewareValidation, generateRouter);

// Route untuk halaman riwayat - GET
router.get('/riwayat', middlewareValidation, function (req, res, next) {
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
router.get('/profil', middlewareValidation, function(req, res, next) {
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
