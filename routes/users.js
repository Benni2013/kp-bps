const express = require("express");
const router = express.Router();

const pemilihanRouter = require("./pemilihan");
const generateRouter = require("./generate");

const { middlewareValidation, isSupervisor } = require("../controllers/AuthController");
const { getRiwayat, getProfile, getDataPemilihan } = require("../controllers/UserController");

// Route untuk halaman beranda - GET
router.get("/beranda", middlewareValidation, function (req, res, next) {
  // dummy data
  let pegawaiTerbaik = true;

  // buat ambil role dari cookie
  let role = req.cookies.role;
  const akun = req.user;

  res.render("user/beranda", {
    title: "Beranda",
    pegawaiTerbaik: pegawaiTerbaik,
    layout: "layouts/layout",
    role,
    akun,
  });
});

// Route untuk halaman Dashboard (SUPERVISOR) - GET
router.get("/dashboard", middlewareValidation, isSupervisor, getDataPemilihan, function (req, res, next) {
  
});

// Router untuk pemilihan - USE
router.use("/pemilihan", pemilihanRouter);

// Router untuk generate - USE
router.use("/generate", generateRouter);

// Route untuk halaman riwayat - GET
router.get("/riwayat", middlewareValidation, getRiwayat, async function (req, res, next) {});

// Route untuk halaman profil - GET
router.get("/profil", middlewareValidation, getProfile, function (req, res, next) {});

module.exports = router;
