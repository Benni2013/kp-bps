// UserController

// - getPegawaiTerbaik (utk beranda)                (done, menunggu hasil pemenang)
// - getDataPemilihan (utk dashboard supervisor)    (done)
// - getRiwayat (utk riwayat pemilihan)             (done, menunggu hasil pemenang)
// - getProfile (utk profile)                       (done)

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, where, json } = require("sequelize");
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1, Voting2, Indikator, Periode, sequelize } = require("../models");
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
      order: [["tanggal_mulai", "DESC"]],
    });
    if (!pemilihan) {
      ada = true;
      return res.render("supervisor/dashboard", {
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
          role: {
            [Op.ne]: "admin",
          },
          ...(akun.divisi !== "Kepala BPS Kota Padang"
            ? {
                divisi: akun.divisi,
              }
            : {}),
        },
      });

      // console.log("Anggota Saya : ", JSON.stringify(anggota, null, 2));

      for (let i = 0; i < anggota.length; i++) {
        let detail_pemilihan = await DetailPemilihan.findOne({
          where: {
            pemilihan_id: pemilihan.pemilihan_id,
            anggota_id: anggota[i].nip,
          },
        });

        // Skip if detail_pemilihan not found
        if (!detail_pemilihan) {
          anggota[i].voting1 = false;
          anggota[i].voting2 = false;
          continue;
        }

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
    // res.redirect("/users/beranda");
    next(error);
  }
};

// const getPegawaiTerbaik = async (req, res, next) => {
//   try {
//     let role = req.cookies.role;
//     const akun = req.user;
//     let pemilihan = await Pemilihan.findAll({
//       where: {
//         tahap_pemilihan: "selesai",
//       },
//     });
//     if (!pemilihan) {
//       res.render("user/beranda", {
//         title: "Beranda",
//         layout: "layouts/layout",
//         role,
//         akun,
//       });
//     } else {
//       let pegawaiTerbaik = true;
//       res.render("user/beranda", {
//         title: "Beranda",
//         pegawaiTerbaik: pegawaiTerbaik,
//         layout: "layouts/layout",
//         role,
//         akun,
//       });
//     }
//   } catch (error) {
//     console.error("getPegawaiTerbaik error:", error);
//     res.redirect("/users/beranda");
//   }
// };

const getPegawaiTerbaik = async (req, res, next) => {
  try {
    const activePemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: {
          [Op.ne]: "tutup",
        },
      },
      include: [
        {
          model: Periode,
          attributes: ["nama_periode"],
        },
      ],
      order: [["tanggal_mulai", "DESC"]],
    });

    // Get pemilihan data dengan periode

    let pemenang = null;
    let pemilihanTitle = null;

    if (!activePemilihan) {
      return next(eror);
    }
    if (activePemilihan.tahap_pemilihan === "selesai") {
      pemilihanTitle = `${activePemilihan.nama_pemilihan} ${activePemilihan.Periode.nama_periode} Tahun ${activePemilihan.tahun}`;

      // Get jumlah indikator aktif
      const jumlahIndikator = await Voting2.count({
        where: {
          "$DetailPemilihan.pemilihan_id$": activePemilihan.pemilihan_id,
        },
        include: [
          {
            model: DetailPemilihan,
            required: true,
            attributes: [],
          },
        ],
        distinct: true,
        col: "indikator_id",
      });

      // Get jumlah pengisi penilaian
      const jumlahPengisi = await DetailPemilihan.count({
        where: { pemilihan_id: activePemilihan.pemilihan_id },
        include: [
          {
            model: Voting2,
            required: true,
            attributes: [],
          },
        ],
        distinct: true,
      });

      // Get semua kandidat yang lolos
      const kandidat = await DetailPemilihan.findAll({
        where: {
          pemilihan_id: activePemilihan.pemilihan_id,
          "$Voting1.status_anggota$": "lolos",
        },
        include: [
          {
            model: Anggota,
            attributes: ["nip", "nama", "jabatan", "gender", "foto"],
          },
          {
            model: Voting1,
            required: true,
            attributes: ["status_anggota"],
          },
        ],
        group: ["DetailPemilihan.detail_pemilihan_id", "Anggotum.nip", "Anggotum.nama", "Anggotum.jabatan", "Anggotum.gender", "Anggotum.foto", "Voting1.status_anggota"],
      });

      console.log(JSON.stringify(kandidat, null, 2));

      // Get nilai semua kandidat
      const hasilKriteria = await Promise.all(
        kandidat.map(async (k) => {
          const totalPoin = await Voting2.sum("nilai", {
            where: {
              kandidat_id: k.anggota_id,
              "$DetailPemilihan.pemilihan_id$": activePemilihan.pemilihan_id,
            },
            include: [
              {
                model: DetailPemilihan,
                required: true,
                attributes: [],
              },
            ],
          });

          // Hitung rata-rata
          const rataRata = (totalPoin / jumlahPengisi / (jumlahIndikator * 4)) * 100;

          let foto_default = k.Anggotum.gender === "pria" ? "/default_pp/lk.png" : "/default_pp/pr.png";

          return {
            nama: k.Anggotum.nama,
            nip: k.Anggotum.nip,
            jabatan: k.Anggotum.jabatan,
            foto: k.Anggotum.foto || foto_default,
            totalPoin,
            rataRata: parseFloat(rataRata.toFixed(2)),
          };
        })
      );

      // Sort berdasarkan rata-rata tertinggi
      hasilKriteria.sort((a, b) => b.rataRata - a.rataRata);

      // Ambil kandidat dengan nilai tertinggi
      pemenang = hasilKriteria[0];

      if (!pemenang) {
        return res.status(404).send("Pemenang tidak ditemukan");
      }
    }

    // console.log('\nData Pemenang:');
    // console.log(JSON.stringify(pemenang, null, 2));

    res.render("user/beranda", {
      title: "Beranda",
      pegawaiTerbaik: pemenang,
      layout: "layouts/layout",
      pemilihanTitle,
      pemenang,
      akun: req.user,
    });
  } catch (error) {
    console.error("Error getting pegawai terbaik:", error);
    next(error);
  }
};

const getRiwayat = async (req, res, next) => {
  try {
    const periodeList = await Periode.findAll({
      attributes: ["periode_id", "nama_periode"],
      order: [["periode_id", "ASC"]],
    });

    // Get tahun unik dari pemilihan untuk filter
    const tahunList = await Pemilihan.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("tahun")), "tahun"]],
      order: [["tahun", "DESC"]],
    });
    let role = req.cookies.role;
    const { periode_id, tahun } = req.query;

    // Convert string parameters to arrays
    const selectedPeriodes = periode_id ? periode_id.split(",") : [];
    const selectedTahun = tahun ? tahun.split(",") : [];

    // Apply filter
    let whereClause = {
      tahap_pemilihan: {
        [Op.in]: ["selesai"],
      },
    };

    if (selectedPeriodes.length > 0) {
      whereClause.periode_id = {
        [Op.in]: selectedPeriodes,
      };
    }

    if (selectedTahun.length > 0) {
      whereClause.tahun = {
        [Op.in]: selectedTahun,
      };
    }

    const riwayatPemilihan = await Pemilihan.findAll({
      where: whereClause,
      include: [
        {
          model: Periode,
          attributes: ["nama_periode"],
        },
      ],
      order: [["tanggal_mulai", "DESC"]],
    });

    // Get pemenang untuk setiap pemilihan yang selesai
    const riwayatData = await Promise.all(
      riwayatPemilihan.map(async (pemilihan) => {
        let pemenangData = null;

        if (pemilihan.tahap_pemilihan === "selesai") {
          // Get jumlah indikator dan pengisi
          const jumlahIndikator = await Voting2.count({
            where: {
              "$DetailPemilihan.pemilihan_id$": pemilihan.pemilihan_id,
            },
            include: [
              {
                model: DetailPemilihan,
                required: true,
                attributes: [],
              },
            ],
            distinct: true,
            col: "indikator_id",
          });

          const jumlahPengisi = await DetailPemilihan.count({
            where: { pemilihan_id: pemilihan.pemilihan_id },
            include: [
              {
                model: Voting2,
                required: true,
              },
            ],
            distinct: true,
          });

          // Get semua kandidat yang lolos
          const kandidat = await DetailPemilihan.findAll({
            where: {
              pemilihan_id: pemilihan.pemilihan_id,
              "$Voting1.status_anggota$": "lolos",
            },
            include: [
              {
                model: Anggota,
                attributes: ["nip", "nama", "gender", "foto", "divisi"], // Include divisi
              },
              {
                model: Voting1,
                required: true,
                where: { status_anggota: "lolos" },
              },
            ],
          });

          // Hitung nilai untuk setiap kandidat
          const hasilKriteria = await Promise.all(
            kandidat.map(async (k) => {
              const totalPoin = await Voting2.sum("nilai", {
                where: {
                  kandidat_id: k.anggota_id,
                  "$DetailPemilihan.pemilihan_id$": pemilihan.pemilihan_id,
                },
                include: [
                  {
                    model: DetailPemilihan,
                    required: true,
                    attributes: [],
                  },
                ],
              });

              const rataRata = (totalPoin / jumlahPengisi / (jumlahIndikator * 4)) * 100;

              return {
                nama: k.Anggotum.nama,
                divisi: k.Anggotum.divisi, // Include divisi here
                foto: k.Anggotum.foto || (k.Anggotum.gender === "pria" ? "/default_pp/lk.png" : "/default_pp/pr.png"),
                rataRata: parseFloat(rataRata.toFixed(2)),
              };
            })
          );

          // Sort dan ambil nilai tertinggi
          hasilKriteria.sort((a, b) => b.rataRata - a.rataRata);
          pemenangData = hasilKriteria[0];
        }

        return {
          id: pemilihan.pemilihan_id,
          title: `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} Tahun ${pemilihan.tahun}`,
          tanggal: new Date(pemilihan.tanggal_mulai).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          status: pemilihan.tahap_pemilihan,
          pemenang: pemenangData,
        };
      })
    );

    res.render("user/riwayat", {
      title: "Riwayat Pemilihan",
      layout: "layouts/layout",
      riwayatPemilihan: riwayatData,
      periodeList,
      tahunList: tahunList.map((t) => t.tahun),
      selectedPeriode: selectedPeriodes,
      selectedTahun: selectedTahun,
      akun: req.user,
      role,
    });
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
