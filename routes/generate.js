const express = require('express');
const router = express.Router();

// Route untuk download laporan hasil pemilihan (Router Dummy) - GET
router.get('/laporan_hasil_pemilihan', (req, res) => {
  // Implementasi download laporan bisa ditambahkan di sini
  res.send('<h1>Download laporan hasil pemilihan</h1>');
});



module.exports = router;