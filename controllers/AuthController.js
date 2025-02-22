// AuthController

// - login            (done)
// - ganti password   (done)
// - middlewareCheck  (done)
// - logout (opsional)(done)

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Anggota } = require('../models');
require('dotenv').config();

// Middleware untuk validasi token
const middlewareValidation = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secret_key@bps1371');
    const anggota = await Anggota.findByPk(decoded.nip);
    
    if (!anggota) {
      return res.redirect('/auth/login');
    }

    if (!anggota.foto || !fs.existsSync(path.join(__dirname, '../public', anggota.foto)) && !anggota.foto.toLowerCase().includes('http')) {
      const defaultPath = '/default_pp/';
      anggota.foto = defaultPath + (anggota.gender === 'wanita' ? 'pr.png' : 'lk.png');
    }

    // Simpan data user untuk digunakan di route lain
    req.user = anggota;


    next();
  } catch (error) {
    console.error('Middleware validation error:', error);
    res.redirect('/auth/login');
  }
};

// Middleware untuk cek role admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secret_key@bps1371');
    const anggota = await Anggota.findByPk(decoded.nip);
    
    if (!anggota || anggota.role !== 'admin') {
      return res.redirect('/users/beranda');
    }

    next();
  } catch (error) {
    console.error('Admin validation error:', error);
    res.redirect('/auth/login');
  }
};

// Middleware untuk cek role supervisor
const isSupervisor = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secret_key@bps1371');
    const anggota = await Anggota.findByPk(decoded.nip);
    
    if (!anggota || anggota.role !== 'supervisor') {
      return res.redirect('/users/beranda');
    }

    next();
  } catch (error) {
    console.error('Supervisor validation error:', error);
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
      { 
        nip: anggota.nip, 
        role: anggota.role,
      },
      process.env.SECRET_KEY || 'secret_key@bps1371',
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
      title: 'Login',
      error: 'Terjadi kesalahan saat login',
      layout: 'layouts/layout_login'
    });
  }
};

// Controller untuk logout
const logout = (req, res) => {
  try {
    // Hapus cookies
    res.clearCookie('token');
    res.clearCookie('role');
    
    // Redirect ke halaman login
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
    res.redirect('/auth/login');
  }
};

// Controller untuk change password
const changePassword = async (req, res) => {
  try {
    const { 'old-password': oldPassword, 'new-password': newPassword, 'confirm-password': confirmPassword } = req.body;
    const anggota = req.user;
    let role = req.cookies.role;

    // Validasi password lama
    const validPassword = await bcrypt.compare(oldPassword, anggota.password);
    if (!validPassword) {
      return res.render('user/change_password', {
        title: 'Ubah Password',
        layout: 'layouts/profile',
        error: 'Password lama tidak sesuai',
        role,
        akun: anggota
      });
    }

    // Cek konfirmasi password
    if (newPassword !== confirmPassword) {
      return res.render('user/change_password', {
        title: 'Ubah Password',
        layout: 'layouts/profile',
        error: 'Konfirmasi password baru tidak sesuai',
        role,
        akun: anggota
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await Anggota.update(
      { password: hashedPassword },
      { where: { nip: anggota.nip } }
    );

    if (role === 'admin') {
      res.redirect('/admin')
    } else {
      res.redirect('/users/beranda');
    }

  } catch (error) {
    console.error('Change password error:', error);
    res.render('user/change_password', {
      title: 'Ubah Password',
      layout: 'layouts/profile',
      error: 'Terjadi kesalahan saat mengubah password',
      role: req.cookies.role,
      akun: req.user
    });
  }
};

module.exports = {
  login,
  middlewareValidation,
  isAdmin,
  isSupervisor,
  logout,
  changePassword,
};