// UserVoting

// - getKandidatVot1 (utk saat akan milih 3 besar)
// - setVot1 (simpan pilihan)                               (done)
// - getMyVot (lihat kandidat yg dipilih)                   (done)
// - getKandidatKriteria (untuk saat penilaian kriteria)    (done)
// - setPenilaianKriteria (simpan penilaian kriteria)

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1, Voting2, Indikator } = require("../models");
require("dotenv").config();

// Middleware untuk validasi token
const getKandidatVot1 = async (req, res, next) => {
  try {
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
    const akun = req.user;

    res.render("user/voting", {
      title: "Voting",
      layout: "layouts/layout",
      role,
      data_nilai,
      akun,
    });
  } catch (error) {
    console.error("getKandidatVot1 validation error:", error);
    res.redirect("users/beranda");
  }
};

const setVot1 = async (req, res, next) => {
  try {
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

    const voting1 = await Voting1.create({
      detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
      pilihan1,
      pilihan2,
      pilihan3,
      waktu_vot1: new Date(),
    });

    res.redirect("/users/pemilihan/hasil-voting");
  } catch (error) {
    console.error("setVot1 validation error:", error);
    res.redirect("users/beranda");
  }
};

const getMyVot = async (req, res, next) => {
  try {
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

    let nama_pilihan = await Voting1.findOne({
      where: {
        detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
      },
    });

    let pil1 = await Anggota.findOne({
      where: {
        nip: nama_pilihan.pilihan1,
      },
    });

    let pil2 = await Anggota.findOne({
      where: {
        nip: nama_pilihan.pilihan2,
      },
    });

    let pil3 = await Anggota.findOne({
      where: {
        nip: nama_pilihan.pilihan3,
      },
    });

    console.log("----------------" + nama_pilihan.pilihan2);
    res.render("user/hasil-voting", {
      title: "Hasil Voting",
      layout: "layouts/layout",
      pil1,
      pil2,
      pil3,
      akun,
    });
  } catch (error) {
    console.error("getMyVot validation error:", error);
    res.redirect("users/beranda");
  }
};

const getKandidatKriteria = async (req, res, next) => {
  try {
    let inditakor = await Indikator.findAll({
      where: {
        status_inditakor: "aktif",
      },
    });
    // buat ambil role dari cookie
    let role = req.cookies.role;
    const akun = req.user;

    let kandidatKriteria = await Voting1.findAll({
      where: {
        status_anggota: "lolos",
      },
    });

    for (let j = 0; j < kandidatKriteria.length; j++) {
      let detail_lulus = await DetailPemilihan.findOne({
        where: {
          detail_pemilihan_id: kandidatKriteria[j].detail_pemilihan_id,
        },
      });
      kandidatKriteria[j].nip_lulus = detail_lulus.anggota_id;
    }
    for (let i = 0; i < kandidatKriteria.length; i++) {
      let nama_lulus = await Anggota.findOne({
        where: {
          nip: kandidatKriteria[i].nip_lulus,
        },
      });
      kandidatKriteria[i].nama = nama_lulus.nama;
    }

    const openPenilaian = true;
    const sudahNilai = false;

    if (sudahNilai) {
      res.redirect("/users/pemilihan/thank-you");
    } else {
      res.render("user/penilaian_kriteria", {
        title: "Penilaian Kriteria",
        layout: "layouts/layout",
        inditakor,
        openPenilaian,
        role,
        akun,
        kandidatKriteria,
      });
    }
  } catch (error) {
    console.error("getKandidatKriteria validation error:", error);
    res.redirect("users/beranda");
  }
};

const setPenilaianKriteria = async (req, res, next) => {
  try {
    // Ambil pemilihan yang sedang berjalan
    let pemilihan = await Pemilihan.findOne({
      where: {
        status: "berjalan",
      },
    });

    if (!pemilihan) {
      throw new Error("Tidak ada pemilihan yang sedang berjalan.");
    }

    const akun = req.user;

    // Ambil detail pemilihan untuk akun saat ini
    let detail_pemilihan = await DetailPemilihan.findOne({
      where: {
        pemilihan_id: pemilihan.pemilihan_id,
        anggota_id: akun.nip,
      },
    });

    if (!detail_pemilihan) {
      throw new Error("Detail pemilihan tidak ditemukan untuk akun ini.");
    }

    // Ambil kandidat yang lolos pada tahap 1
    let kandidatKriteria = await Voting1.findAll({
      where: {
        status_anggota: "lolos",
      },
    });

    if (!kandidatKriteria || kandidatKriteria.length === 0) {
      throw new Error("Tidak ada kandidat yang lolos pada tahap 1.");
    }

    // Ambil semua kriteria aktif
    let kriteriaAktif = await Indikator.findAll({
      where: {
        status_inditakor: "aktif",
      },
    });

    if (!kriteriaAktif || kriteriaAktif.length === 0) {
      throw new Error("Tidak ada kriteria aktif.");
    }

    // Proses penilaian berdasarkan input form
    for (let kriteria of kriteriaAktif) {
      for (let kandidat of kandidatKriteria) {
        // Ambil nilai dari req.body berdasarkan nama field yang dinamis
        let fieldName = `criteria-${kriteria.indikator_id}-${kandidat.detail_pemilihan_id}`;
        let nilai = parseInt(req.body[fieldName]);

        if (!nilai || nilai < 1 || nilai > 4) {
          throw new Error(`Nilai tidak valid untuk ${fieldName}`);
        }

        // Simpan penilaian ke database
        await Voting2.create({
          detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
          indikator_id: kriteria.indikator_id,
          kandidat_id: kandidat.pilihan1,
          nilai: nilai,
          waktu_vot2: new Date(),
          status_vot2: "berjalan",
        });
      }
    }

    res.redirect("/users/pemilihan/thank-you");
  } catch (error) {
    console.error("setPenilaianKriteria validation error:", error);
    res.redirect("/users/beranda");
  }
};

module.exports = {
  getKandidatVot1,
  setVot1,
  getMyVot,
  getKandidatKriteria,
  setPenilaianKriteria,
};
