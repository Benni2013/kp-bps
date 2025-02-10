// UserVoting

// - getKandidatVot1 (utk saat akan milih 3 besar)
// - setVot1 (simpan pilihan)                                       (done)
// - getMyVot (lihat kandidat yg dipilih)                           (done)
// - getKandidatKriteria (untuk saat penilaian kriteria)            (done)
// - setPenilaianKriteria (simpan penilaian kriteria)               (done)
// - getMyPenilaianKriteria (lihat penilaian kriteria yg dipilih)   (done)

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1, Voting2, Indikator, sequelize } = require("../models");
require("dotenv").config();
const { Op } = require("sequelize");

// Middleware untuk validasi token
const getKandidatVot1 = async (req, res, next) => {
  try {
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting1",
      },
    });
    let role = req.cookies.role;
    const akun = req.user;

    if (!pemilihan) {
      statusnya = false;
      res.render("user/voting", {
        title: "Voting",
        layout: "layouts/layout",
        pemilihan,
        akun,
        statusnya,
        role
      });
      console.log("=========================");
    } else {
      statusnya = true;
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
        akun,
        statusnya,
      });
    }
  } catch (error) {
    console.error("getKandidatVot1 validation error:", error);
    res.redirect("/users/beranda");
  }
};

const setVot1 = async (req, res, next) => {
  try {
    const { pilihan1, pilihan2, pilihan3 } = req.body;

    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting1",
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
    res.redirect("/users/beranda");
  }
};

const getMyVot = async (req, res, next) => {
  try {
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting1",
      },
    });
    let role = req.cookies.role;
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

    res.render("user/hasil-voting", {
      title: "Hasil Voting",
      layout: "layouts/layout",
      pil1,
      pil2,
      pil3,
      akun,
      role,
    });
  } catch (error) {
    console.error("getMyVot validation error:", error);
    res.redirect("/users/beranda");
  }
};

const getKandidatKriteria = async (req, res, next) => {
  try {
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting2",
      },
    });

    // Get kandidat yang lolos (status_anggota tidak null)
    let kandidatKriteria = await Voting1.findAll({
      where: {
        status_anggota: {
          [Op.not]: null
        }
      },
      include: [{
        model: DetailPemilihan,
        where: { pemilihan_id: pemilihan.pemilihan_id },
        include: [{
          model: Anggota,
          attributes: ['nip', 'nama']
        }]
      }]
    });

    console.log(kandidatKriteria);
    
    let role = req.cookies.role;
    const akun = req.user;

    if (!pemilihan || kandidatKriteria.length === 0) {
      statusnya = true;
      res.render("user/penilaian_kriteria", {
        title: "Penilaian Kriteria",
        layout: "layouts/layout",
        pemilihan,
        statusnya,
        akun,
        role,
      });
    } else {
      let detail_pemilihan = await DetailPemilihan.findOne({
        where: {
          pemilihan_id: pemilihan.pemilihan_id,
          anggota_id: akun.nip,
        },
      });
      let detail_voting2 = await Voting2.findOne({
        where: {
          detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
        },
      });
      if (detail_voting2) {
        res.redirect("/users/pemilihan/thank-you");
      } else {
        let inditakor = await Indikator.findAll({
          where: {
            status_inditakor: "aktif",
          },
        });
        // buat ambil role dari cookie
        let role = req.cookies.role;

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
        res.render("user/penilaian_kriteria", {
          title: "Penilaian Kriteria",
          layout: "layouts/layout",
          inditakor,
          role,
          akun,
          kandidatKriteria,
        });
      }
    }
  } catch (error) {
    console.error("getKandidatKriteria validation error:", error);
    res.redirect("/users/beranda");
  }
};

const setPenilaianKriteria = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Get pemilihan aktif
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting2",
      }
    });

    if (!pemilihan) {
      throw new Error("Tidak ada pemilihan yang sedang berjalan.");
    }

    const akun = req.user;

    // Get detail pemilihan penilai
    let detail_pemilihan = await DetailPemilihan.findOne({
      where: {
        pemilihan_id: pemilihan.pemilihan_id,
        anggota_id: akun.nip,
      }
    });

    if (!detail_pemilihan) {
      throw new Error("Detail pemilihan tidak ditemukan.");
    }

    // Get semua kandidat yang lolos
    let kandidatKriteria = await Voting1.findAll({
      where: { 
        status_anggota: "lolos",
        '$DetailPemilihan.pemilihan_id$': pemilihan.pemilihan_id
      },
      include: [{
        model: DetailPemilihan,
        required: true,
        include: [{
          model: Anggota,
          attributes: ['nip', 'nama']
        }]
      }]
    });

    // Get semua indikator aktif
    let indikatorList = await Indikator.findAll({
      where: {
        status_inditakor: "aktif",
      },
      order: [['indikator_id', 'ASC']]
    });

    console.log('\nData yang akan diproses:');
    console.log('Jumlah kandidat:', kandidatKriteria.length);
    console.log('Jumlah indikator:', indikatorList.length);

    // Proses setiap kombinasi kandidat dan indikator
    const penilaianPromises = [];

    for (const kandidat of kandidatKriteria) {
      for (let i = 0; i < indikatorList.length; i++) {
        const fieldName = `criteria-${i}-${kandidat.detail_pemilihan_id}`;
        const nilai = parseInt(req.body[fieldName]);

        if (isNaN(nilai) || nilai < 1 || nilai > 4) {
          throw new Error(`Nilai tidak valid untuk ${fieldName}`);
        }

        console.log(`\nMenyimpan nilai untuk:`);
        console.log(`Kandidat: ${kandidat.DetailPemilihan.Anggotum.nama}`);
        console.log(`Indikator: ${indikatorList[i].isi_indikator}`);
        console.log(`Nilai: ${nilai}`);

        penilaianPromises.push(
          Voting2.create({
            detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
            indikator_id: indikatorList[i].indikator_id,
            kandidat_id: kandidat.DetailPemilihan.anggota_id,
            nilai: nilai,
            waktu_vot2: new Date()
          }, { transaction })
        );
      }
    }

    // Simpan semua penilaian
    await Promise.all(penilaianPromises);
    await transaction.commit();

    console.log('\nSemua penilaian berhasil disimpan');
    res.redirect("/users/pemilihan/thank-you");

  } catch (error) {
    await transaction.rollback();
    console.error("setPenilaianKriteria error:", error);
    res.redirect("/users/beranda");
  }
};

const getMyPenilaianKriteria = async (req, res, next) => {
  try {
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting2",
      },
    });
    const akun = req.user;

    let detail_pemilihan = await DetailPemilihan.findOne({
      where: {
        pemilihan_id: pemilihan.pemilihan_id,
        anggota_id: akun.nip,
      },
    });

    let waktu_voting = await Voting2.findOne({
      where: {
        detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
      },
    });
    let role = req.cookies.role;
    res.render("user/thank-you", {
      title: "Thank You",
      layout: "layouts/layout",
      role,
      akun,
      waktu_voting,
    });
  } catch (error) {
    console.error("getMyVot validation error:", error);
    res.redirect("/users/beranda");
  }
};

module.exports = {
  getKandidatVot1,
  setVot1,
  getMyVot,
  getKandidatKriteria,
  setPenilaianKriteria,
  getMyPenilaianKriteria,
};
