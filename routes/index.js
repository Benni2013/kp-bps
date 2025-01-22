var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { layout: "index" });
});

router.get('/login', function(req, res, next) {
  res.render('auth/login', { layout: 'layouts/layout_login' });
});

/* GET beranda page */
router.get('/beranda', function (req, res, next) {
  let pegawaiTerbaik = true;
  
  res.render('user/beranda', { 
    title: 'Beranda',
    pegawaiTerbaik: pegawaiTerbaik,
    layout: 'layouts/layout',
   });
});

/* GET voting page. */
router.get('/voting', function (req, res, next) {
  res.render('user/voting', { 
    title: 'Voting',
    layout: 'layouts/layout',
   });
});

router.get('/hasil-voting', function (req, res, next) {
  res.render('user/hasil-voting', { 
    title: 'Hasil Voting',
    layout: 'layouts/layout',
   });
});

router.get('/penilaian', function (req, res, next) {
  const rows = [
    { category: 'Disiplin', indicator: 'Kedisiplinan dalam bekerja' },
    { category: 'Orientasi Pelayanan', indicator: 'Kualitas hasil kerja' },
    { category: 'Kemampuan Kerjasama', indicator: 'Kemampuan kerjasama tim' },
    // Tambahkan hingga 21 baris
  ];
  res.render('user/penilaian_kriteria', { 
    title: 'Penilaian Kriteria',
    layout: 'layouts/layout',
    rows 
  });
});

router.get('/thank-you', function (req, res, next) {
  res.render('user/thank-you', { 
    title: 'Thank You',
    layout: 'layouts/layout', 
  });
});

router.get('/belum', function (req, res, next) {
  res.render('user/penilaian_belum', { 
    title: 'Belum',
    layout: 'layouts/layout', 
  });
});

router.get('/riwayat', function (req, res, next) {
  res.render('user/riwayat', { 
    title: 'Riwayat',
    layout: 'layouts/layout', 
  });
});

// router.get('/login', function (req, res, next) {
//   res.redirect('/');
// });

router.post('/login', function (req, res, next) {
  res.redirect('/beranda');
});

//router.get('/profile', function (req, res, next) {
  //res.render('user/profile', { title: 'Profil' });
//}); bagian dela

router.get('/change-password', function (req, res, next) {
  res.render('user/change_password', { layout: 'layouts/layout_change_password' });
});


router.get('/logout', function (req, res, next) {
  res.redirect('/login'); // Redirect ke halaman login
});
module.exports = router;
