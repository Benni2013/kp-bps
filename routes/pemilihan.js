const express = require('express');
const router = express.Router();

// Route untuk halaman voting - GET
router.get('/voting', function (req, res, next) {
  let telahVoting = false;

  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');

  if (telahVoting) {
    res.redirect('/users/pemilihan/hasil-voting');
  } else {
    res.render('user/voting', { 
      title: 'Voting',
      layout: 'layouts/layout',
      role,
    });
  }
    
});

// Route untuk proses voting - POST
router.post('/voting', function (req, res, next) {
  console.log('\nVoting berhasil\n');
  res.redirect('/users/pemilihan/hasil-voting');
});
  
// Route untuk halaman hasil voting - GET
router.get('/hasil-voting', function (req, res, next) {
  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');

  res.render('user/hasil-voting', { 
    title: 'Hasil Voting',
    layout: 'layouts/layout',
    role,
   });
});
  
// Route untuk halaman penilaian - GET
router.get('/penilaian', function (req, res, next) {
  const rows = [
    { category: 'Disiplin', indicator: 'Kedisiplinan dalam bekerja' },
    { category: 'Orientasi Pelayanan', indicator: 'Kualitas hasil kerja' },
    { category: 'Kemampuan Kerjasama', indicator: 'Kemampuan kerjasama tim' },
    // Tambahkan hingga 21 baris
  ];

  const openPenilaian = true;

  const sudahNilai = false;

  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');

  if (sudahNilai) {
    res.redirect('/users/pemilihan/thank-you');
  } else {
    res.render('user/penilaian_kriteria', { 
      title: 'Penilaian Kriteria',
      layout: 'layouts/layout',
      rows,
      openPenilaian,
      role,
    });
  }
  
});

// Route untuk proses penilaian - POST
router.post('/penilaian', function (req, res, next) {
  console.log('\nPenilaian berhasil\n');
  res.redirect('/users/pemilihan/thank-you');
});
  
// Route untuk halaman Terima Kasih - GET
router.get('/thank-you', function (req, res, next) {
  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log('\nRole: ' + role + '\n');

  res.render('user/thank-you', { 
    title: 'Thank You',
    layout: 'layouts/layout', 
    role,
  });
});

module.exports = router;