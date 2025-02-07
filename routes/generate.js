const express = require("express");
const router = express.Router();
const { middlewareValidation } = require("../controllers/AuthController");
const { terimakasih } = require("../controllers/GenerateController");

// Router untuk download ucapan terimakasih (UNTUK ANGGOTA DAN SUPERVISOR) - GET
router.post("/terimakasih", middlewareValidation, terimakasih, (req, res) => {});

// Router untuk download template excel penilaian - GET
router.get("/download-template", (req, res) => {
  res.send("<h1>Download Template Excel Penilaian</h1>");
});

// Router untuk download excel laporan hasil kandidat eligible - GET
router.get("/download_kandidat_eligible", function (req, res, next) {
  res.send("<h1>Download laporan kandidat eligible</h1>");
});

// Router untuk download laporan hasil voting 1 - GET
router.get("/download_laporan_voting_1", function (req, res, next) {
  res.send("<h1>Download laporan voting 1</h1>");
});

// Route untuk download laporan hasil pemilihan - GET
router.get("/laporan_hasil_pemilihan", (req, res) => {
  // Implementasi download laporan bisa ditambahkan di sini
  res.send("<h1>Download laporan hasil pemilihan</h1>");
});

module.exports = router;
