const express = require('express');
const router = express.Router();

const manajerAnggotaRouter = require('./manajerAnggota');
const manajerKriteriaRouter = require('./manajerKriteria');
const manajerPemilihanRouter = require('./manajerPemilihan');
const pemilihanBerlangsungRouter = require('./pemilihanBerlangsung');
const generateRouter = require('./generate');

const { middlewareValidation, isAdmin } = require('../controllers/AuthController');
const { getDashboardAdmin, getRiwayatPemilihan, getDetailRiwayat } = require('../controllers/AdminMainController');

// Route untuk dashboard admin - GET
router.get('/', middlewareValidation, isAdmin, getDashboardAdmin);

// Route untuk manajemen anggota - USE
router.use('/manajemen_anggota', middlewareValidation, isAdmin, manajerAnggotaRouter);

// Route untuk manajemen kriteria - USE
router.use('/manajemen_kriteria', middlewareValidation, isAdmin, manajerKriteriaRouter);

// Route untuk manajemen pemilihan - USE
router.use('/manajemen_pemilihan', middlewareValidation, isAdmin, manajerPemilihanRouter);

// Route untuk pemilihan berlangsung - USE
router.use('/pemilihan_berlangsung', middlewareValidation, isAdmin, pemilihanBerlangsungRouter);

// Router untuk generate file-file - USE
router.use('/generate', middlewareValidation, generateRouter);

// Route untuk halaman riwayat pemilihan - GET
router.get('/riwayat_pemilihan', middlewareValidation, isAdmin, getRiwayatPemilihan);

// Route untuk halaman detail riwayat pemilihan - GET
router.get('/detail_riwayat/:id', middlewareValidation, isAdmin, getDetailRiwayat);


module.exports = router;
