const express = require('express');
const router = express.Router();

const { login, middlewareValidation } = require('../controllers/AuthController');

// Route untuk halaman login - GET
router.get('/login', function(req, res, next) {
    res.render('auth/login', { 
      title: 'Login',
      layout: 'layouts/layout_login', 
    });
});
  
  
  
  // router.get('/login', function (req, res, next) {
  //   res.redirect('/');
  // });
  
// Route untuk proses login - POST
router.post('/login', login);
  
  //router.get('/profile', function (req, res, next) {
    //res.render('user/profile', { title: 'Profil' });
  //}); bagian dela

// Route untuk halaman ganti password - GET
router.get('/change-password', function (req, res, next) {
  let role = req.cookies.role;


  res.render('user/change_password', { 
    title: 'Ubah Password',
    layout: 'layouts/profile', 
    role
  });
});

// Route untuk proses ganti password - POST
router.post('/change-password', function (req, res, next) {
  let role = req.cookies.role;

  console.log('\nPassword berhasil diubah\n');

  if (role === 'admin') {
    res.redirect('/admin')
  } else {
    res.redirect('/users/beranda');
  }
  
});
  
// Route untuk proses logout - GET
router.get('/logout', function (req, res, next) {
  res.redirect('/auth/login') ; // Redirect ke halaman login
});

module.exports = router;