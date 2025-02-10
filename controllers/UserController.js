// UserController

// - getPegawaiTerbaik (utk beranda)
// - getDataPemilihan (utk dashboard supervisor)    (done)
// - getRiwayat (utk riwayat pemilihan)             (done, menunggu hasil pemenang)
// - getProfile (utk profile)                       (done)

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, where } = require("sequelize");
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1, Voting2, Indikator, Periode } = require("../models");
require("dotenv").config();

const getDataPemilihan = async (req, res, next) => {
  try {
    let v1 = 0;
    let v2 = 0;
    let tv1 = 0;
    let tv2 = 0;
    let role = req.cookies.role;
    const akun = req.user;
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: {
          [Op.or]: ["voting1", "voting2"], // pencarian voting
        },
      },
    });
    if (!pemilihan) {
      ada = true;
      res.render("supervisor/dashboard", {
        title: "Dashboard",
        layout: "layouts/layout",
        role,
        akun,
        ada,
      });
    } else {
      let anggota = await Anggota.findAll({
        where: {
          status_anggota: "aktif",
        },
      });
      console.log("id pemilihan : " + pemilihan.pemilihan_id);

      for (let i = 0; i < anggota.length; i++) {
        let detail_pemilihan = await DetailPemilihan.findOne({
          where: {
            pemilihan_id: pemilihan.pemilihan_id,
            anggota_id: anggota[i].nip,
          },
        });

        let voting1 = await Voting1.findOne({
          where: {
            detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
          },
        });
        if (!voting1) {
          anggota[i].voting1 = false;
        } else {
          v1++;
          anggota[i].voting1 = true;
        }
        let voting2 = await Voting2.findOne({
          where: {
            detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
          },
        });
        if (!voting2) {
          anggota[i].voting2 = false;
        } else {
          v2++;
          anggota[i].voting2 = true;
        }
      }
      tv1 = anggota.length - v1;
      tv2 = anggota.length - v2;
      console.log("idnya orangnya : " + v1 + v2 + tv1 + tv2);

      res.render("supervisor/dashboard", {
        title: "Dashboard",
        layout: "layouts/layout",
        role,
        akun,
        pemilihan,
        anggota,
        v1,
        v2,
        tv1,
        tv2,
      });
    }
  } catch (error) {
    console.error("getDataPemilihan error:", error);
    res.redirect("/users/beranda");
  }
};

const getPegawaiTerbaik = async (req, res, next) => {
  try {
    let role = req.cookies.role;
    const akun = req.user;
    let pemilihan = await Pemilihan.findAll({
      where: {
        tahap_pemilihan: "selesai",
      },
    });
    if (!pemilihan) {
      res.render("user/beranda", {
        title: "Beranda",
        layout: "layouts/layout",
        role,
        akun,
      });
    } else {
      let pegawaiTerbaik = true;
      res.render("user/beranda", {
        title: "Beranda",
        pegawaiTerbaik: pegawaiTerbaik,
        layout: "layouts/layout",
        role,
        akun,
      });
    }
  } catch (error) {
    console.error("getPegawaiTerbaik error:", error);
    res.redirect("/users/beranda");
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
    res.redirect("/users/beranda");
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
    res.redirect("/users/beranda");
  }
};

module.exports = {
  getRiwayat,
  getProfile,
  getDataPemilihan,
  getPegawaiTerbaik,
};
