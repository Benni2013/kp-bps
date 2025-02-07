// UserController

// - getPegawaiTerbaik (utk beranda)
// - getDataPemilihan (utk dashboard supervisor)    (done)
// - getRiwayat (utk riwayat pemilihan)             (done, menunggu hasil pemenang)
// - getProfile (utk profile)                       (done)

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1, Voting2, Indikator, Periode } = require("../models");
require("dotenv").config();

const getDataPemilihan = async (req, res, next) => {
  try {
    let pegawaiTerbaik = true;
    let role = req.cookies.role;
    const akun = req.user;
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting1" || "voting2",
      },
    });

    console.log("====-----=====----" + pemilihan.nama_pemilihan);
    res.render("supervisor/dashboard", {
      title: "Dashboard",
      layout: "layouts/layout",
      role,
      akun,
      pemilihan,
    });
  } catch (error) {
    console.error("getDataPemilihan error:", error);
    res.redirect("users/beranda");
  }
};

const getRiwayat = async (req, res, next) => {
  try {
    let role = req.cookies.role;
    const akun = req.user;
    let pemilihan = await Pemilihan.findAll({
      where: {
        tahap_pemilihan: "selesai",
      },
    });
    let tahun = await Pemilihan.findAll();
    let periode = await Periode.findAll();

    if (!pemilihan) {
      statusnya = true;
      res.render("user/riwayat", {
        title: "Riwayat Pemilihan",
        layout: "layouts/layout",
        role,
        akun,
        statusnya,
      });
    } else {
      res.render("user/riwayat", {
        title: "Riwayat Pemilihan",
        layout: "layouts/layout",
        role,
        akun,
        pemilihan,
        periode,
        tahun,
      });
    }
  } catch (error) {
    console.error("getRiwayat error:", error);
    res.redirect("users/beranda");
  }
};

const getProfile = async (req, res, next) => {
  try {
    // buat ambil role dari cookie
    let role = req.cookies.role;
    const akun = req.user;

    res.render("supervisor/profil", {
      title: "Profil",
      layout: "layouts/profile",
      akun,
    });
  } catch (error) {
    console.error("getProfile error:", error);
    res.redirect("users/beranda");
  }
};

module.exports = {
  getRiwayat,
  getProfile,
  getDataPemilihan,
};
