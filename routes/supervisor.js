var express = require('express');
var router = express.Router();


router.get('/profil', function(req, res, next) {
  res.render('supervisor/profil', { layout: "layouts/profile" });
});

router.get('/dashboard', function(req, res, next) {
  res.render('supervisor/dashboard', { title: 'Express', layout: "layouts/supervisor" });
});

router.get('/beranda', function(req, res, next) {
    res.render('supervisor/beranda', { title: 'Express', layout: "layouts/supervisor" });
  });

  router.get('/voting', function(req, res, next) {
    res.render('supervisor/voting', { title: 'Express', layout: "layouts/supervisor" });
  });

  router.get('/hasil-voting', function(req, res, next) {
    res.render('supervisor/hasil-voting', { title: 'Express', layout: "layouts/supervisor" });
  });


module.exports = router;