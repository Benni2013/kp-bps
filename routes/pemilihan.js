const express = require("express");
const router = express.Router();
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1, Indikator } = require("../models");
require("dotenv").config();
const { middlewareValidation } = require("../controllers/AuthController");
const { getKandidatVot1, setVot1, getMyVot, getKandidatKriteria, setPenilaianKriteria, getMyPenilaianKriteria } = require("../controllers/UserVoting");

// Route untuk halaman voting - GET
router.get("/voting", middlewareValidation, getKandidatVot1, async function (req, res, next) {});

// Route untuk proses voting - POST
router.post("/voting", middlewareValidation, setVot1, async function (req, res, next) {});

// Route untuk halaman hasil voting - GET
router.get("/hasil-voting", middlewareValidation, getMyVot, async function (req, res, next) {});


// Route untuk halaman penilaian - GET
router.get("/penilaian", middlewareValidation, getKandidatKriteria, async function (req, res, next) {
  
});

// Route untuk proses penilaian - POST
router.post("/penilaian", middlewareValidation, setPenilaianKriteria, async function (req, res, next) {
 
});

// Route untuk halaman Terima Kasih - GET
router.get("/thank-you", middlewareValidation, getMyPenilaianKriteria, function (req, res, next) {
  
});

module.exports = router;
