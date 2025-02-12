const express = require("express");
const router = express.Router();

const { middlewareValidation, isAdmin } = require("../controllers/AuthController");
const { terimakasih, 
        downloadTemplatePenilaian, 
        generateLaporanDataNilai, 
        generateLaporanVoting1, 
        generateLaporanPenilaianKriteria,
        generateRekapLaporan,
      } = require("../controllers/GenerateController");

// Router untuk download ucapan terimakasih (UNTUK ANGGOTA DAN SUPERVISOR) - GET
router.post("/terimakasih", middlewareValidation, terimakasih, (req, res) => {});

// Router untuk download template excel penilaian - GET
router.get("/:id/download-template", isAdmin, downloadTemplatePenilaian);

// Router untuk download excel laporan hasil data nilai - GET
router.get("/:id/download_data_nilai", isAdmin, generateLaporanDataNilai);

// Router untuk download laporan hasil voting 1 - GET
router.get("/:id/download_laporan_voting_1", isAdmin, generateLaporanVoting1);

// Route untuk download laporan hasil pemilihan / penilaian kriteria - GET
router.get("/:id/laporan_hasil_pemilihan", isAdmin, generateLaporanPenilaianKriteria);

// Router untuk rekap laporan pemilihan - GET
router.get("/:id/rekap_laporan", isAdmin, generateRekapLaporan);

module.exports = router;
