const express = require('express');
const router = express.Router();

const { getAllPemilihan, getBuatPemilihan, createPemilihan, closePemilihan, deletePemilihan } = require('../controllers/ManajerPemilihan');

// Route untuk halaman manajemen pemilihan - GET
router.get('/', getAllPemilihan);

// Route untuk halaman buat pemilihan - GET
router.get('/buat', getBuatPemilihan);

// Route untuk proses buat pemilihan - POST
router.post('/buat', createPemilihan);

// Route untuk tutup pemilihan - POST
router.post('/tutup/:id', closePemilihan);

// Route untuk hapus pemilihan - POST
router.post('/hapus/:id', deletePemilihan);

module.exports = router;