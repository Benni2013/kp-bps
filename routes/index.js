var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET beranda page */
router.get('/beranda', function (req, res, next) {
  res.render('beranda', { title: 'Beranda' });
});

/* GET voting page. */
router.get('/voting', function (req, res, next) {
  res.render('voting', { title: 'Voting Tahap 1' });
});

router.get('/hasil-voting', function (req, res, next) {
  res.render('hasil-voting', { title: 'Hasil Voting' });
});

router.get('/penilaian', function (req, res, next) {
  const rows = [
    { category: 'Disiplin', indicator: 'Kedisiplinan dalam bekerja' },
    { category: 'Orientasi Pelayanan', indicator: 'Kualitas hasil kerja' },
    { category: 'Kemampuan Kerjasama', indicator: 'Kemampuan kerjasama tim' },
    // Tambahkan hingga 21 baris
  ];
  res.render('penilaian_kriteria', { title: 'Penilaian Kriteria', rows });
});

router.get('/thank-you', function (req, res, next) {
  res.render('thank-you', { title: 'Terima Kasih' });
});


module.exports = router;
