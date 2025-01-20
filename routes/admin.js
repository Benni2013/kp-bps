var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Express' });
});

router.get('/manajemen_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota', { title: 'Express' });
});

router.get('/manajemen_kriteria', function(req, res, next) {
  res.render('admin/manajemen_kriteria', { title: 'Express' });
});


module.exports = router;
