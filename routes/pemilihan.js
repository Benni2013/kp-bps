const express = require("express");
const router = express.Router();
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1 } = require("../models");
require("dotenv").config();
const { middlewareValidation } = require("../controllers/AuthController");

// Route untuk halaman voting - GET
router.get("/voting", async function (req, res, next) {
  // buat ambil role dari cookie
  let role = req.cookies.role;
  const data_nilai = await DataNilai.findAll({
    where: { status_anggota: "eligible" },
  });

  for (let j = 0; j < data_nilai.length; j++) {
    let detail_pemilihan = await DetailPemilihan.findOne({
      where: {
        detail_pemilihan_id: data_nilai[j].detail_pemilihan_id,
      },
    });
    data_nilai[j].data_id_anggota = detail_pemilihan.anggota_id;
  }

  for (let i = 0; i < data_nilai.length; i++) {
    let anggota = await Anggota.findOne({
      where: {
        nip: data_nilai[i].data_id_anggota,
      },
    });
    data_nilai[i].data_nama_anggota = anggota.nama;
    data_nilai[i].data_nip_anggota = anggota.nip;
  }

  res.render("user/voting", {
    title: "Voting",
    layout: "layouts/layout",
    role,
    data_nilai,
  });
});

// Route untuk proses voting - POST
router.post("/voting", middlewareValidation, async function (req, res, next) {
  const { pilihan1, pilihan2, pilihan3 } = req.body;

  let pemilihan = await Pemilihan.findOne({
    where: {
      status: "berjalan",
    },
  });
  const akun = req.user;

  let detail_pemilihan = await DetailPemilihan.findOne({
    where: {
      pemilihan_id: pemilihan.pemilihan_id,
      anggota_id: akun.nip,
    },
  });

  skor_pil1 = 3;
  skor_pil2 = 2;
  skor_pil3 = 1;
  total_skor = pilihan1 * skor_pil1 + pilihan2 * skor_pil2 + pilihan3 * skor_pil3;
  status_anggota = "lolos";
  status_vot1 = "berjalan";

  const voting1 = await Voting1.create({
    detail_pemilihan_id: detail_pemilihan.pemilihan_id,
    pilihan1,
    pilihan2,
    pilihan3,
    skor_pil1,
    skor_pil2,
    skor_pil3,
    total_skor,
    waktu_vot1: new Date(),
    status_anggota,
    status_vot1,
    
  });

  res.redirect("/users/pemilihan/hasil-voting");
});

// Route untuk halaman hasil voting - GET
router.get("/hasil-voting", function (req, res, next) {
  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log("\nRole: " + role + "\n");

  res.render("user/hasil-voting", {
    title: "Hasil Voting",
    layout: "layouts/layout",
    role,
  });
});

// Route untuk halaman penilaian - GET
router.get("/penilaian", function (req, res, next) {
  const rows = [
    { category: "Disiplin", indicator: "Kedisiplinan dalam bekerja" },
    { category: "Orientasi Pelayanan", indicator: "Kualitas hasil kerja" },
    { category: "Kemampuan Kerjasama", indicator: "Kemampuan kerjasama tim" },
    // Tambahkan hingga 21 baris
  ];

  const openPenilaian = true;

  const sudahNilai = false;

  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log("\nRole: " + role + "\n");

  if (sudahNilai) {
    res.redirect("/users/pemilihan/thank-you");
  } else {
    res.render("user/penilaian_kriteria", {
      title: "Penilaian Kriteria",
      layout: "layouts/layout",
      rows,
      openPenilaian,
      role,
    });
  }
});

// Route untuk proses penilaian - POST
router.post("/penilaian", function (req, res, next) {
  console.log("\nPenilaian berhasil\n");
  res.redirect("/users/pemilihan/thank-you");
});

// Route untuk halaman Terima Kasih - GET
router.get("/thank-you", function (req, res, next) {
  // buat ambil role dari cookie
  let role = req.cookies.role;

  console.log("\nRole: " + role + "\n");

  res.render("user/thank-you", {
    title: "Thank You",
    layout: "layouts/layout",
    role,
  });
});

module.exports = router;
