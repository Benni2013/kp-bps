// AuthController

// - login
// - ganti password
// - middlewareCheck
// - logout (opsional)

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Anggota } = require('../models');

// Middleware untuk validasi token
const middlewareValidation = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const anggota = await Anggota.findByPk(decoded.nip);
    
    if (!anggota) {
      return res.redirect('/auth/login');
    }

    // Simpan data user untuk digunakan di route lain
    req.user = anggota;
    next();
  } catch (error) {
    console.error('Middleware validation error:', error);
    res.redirect('/auth/login');
  }
};

// Controller untuk login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari anggota berdasarkan NIP
    const anggota = await Anggota.findByPk(username);
    if (!anggota) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Username atau Password salah',
        layout: 'layouts/layout_login',
      });
    }

    // Validasi password
    const validPassword = await bcrypt.compare(password, anggota.password);
    if (!validPassword) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Username atau Password salah',
        layout: 'layouts/layout_login',
      });
    }

    // Buat token JWT
    const token = jwt.sign(
      { nip: anggota.nip, role: anggota.role },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Set cookie
    res.cookie('token', token, { httpOnly: true });
    res.cookie('role', anggota.role);

    // Redirect sesuai role
    if (anggota.role === 'supervisor') {
      res.redirect('/users/dashboard');
    } else if (anggota.role === 'admin') {
      res.redirect('/admin/');
    } else {
      res.redirect('/users/beranda');
    }

  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      error: 'Terjadi kesalahan saat login',
      layout: 'layouts/layout_login'
    });
  }
};

module.exports = {
  login,
  middlewareValidation
};