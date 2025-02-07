const express = require("express");
const router = express.Router();

const { middlewareValidation, isAdmin } = require("../controllers/AuthController");
const { terimakasih, downloadTemplatePenilaian } = require("../controllers/GenerateController");

// Router untuk download ucapan terimakasih (UNTUK ANGGOTA DAN SUPERVISOR) - GET
router.post("/terimakasih", middlewareValidation, terimakasih, (req, res) => {});

// Router untuk download template excel penilaian - GET
router.get("/:id/download-template", isAdmin, downloadTemplatePenilaian, (req, res) => {});

// Router untuk download excel laporan hasil kandidat eligible - GET
router.get("/:id/download_kandidat_eligible", isAdmin, function (req, res, next) {
  res.send("<h1>Download laporan kandidat eligible</h1>");
});

// Router untuk download laporan hasil voting 1 - GET
router.get("/:id/download_laporan_voting_1", isAdmin, function (req, res, next) {
  res.send("<h1>Download laporan voting 1</h1>");
});

// Route untuk download laporan hasil pemilihan - GET
router.get("/:id/laporan_hasil_pemilihan", isAdmin, (req, res) => {
  // Implementasi download laporan bisa ditambahkan di sini
  res.send("<h1>Download laporan hasil pemilihan</h1>");
});

module.exports = router;
