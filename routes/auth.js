const express = require('express');
const router = express.Router();

const { login, middlewareValidation, logout, changePassword } = require('../controllers/AuthController');

// Route untuk halaman login - GET
router.get('/login', function(req, res, next) {
    res.render('auth/login', { 
      title: 'Login',
      layout: 'layouts/layout_login', 
    });
});
  
// Route untuk proses login - POST
router.post('/login', login);

// Route untuk halaman ganti password - GET
router.get('/change-password', middlewareValidation, function (req, res, next) {
  let role = req.cookies.role;
  const akun = req.user;

  res.render('user/change_password', { 
    title: 'Ubah Password',
    layout: 'layouts/profile', 
    role,
    akun,
  });
});

// Route untuk proses ganti password - POST
router.post('/change-password', middlewareValidation, changePassword);
  
// Route untuk proses logout - GET
router.get('/logout', logout);

module.exports = router;