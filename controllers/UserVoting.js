// UserVoting

// - getKandidatVot1 (utk saat akan milih 3 besar)                  (done)
// - setVot1 (simpan pilihan)                                       (done)
// - getMyVot (lihat kandidat yg dipilih)                           (done)
// - getKandidatKriteria (untuk saat penilaian kriteria)            (done)
// - setPenilaianKriteria (simpan penilaian kriteria)               (done)
// - getMyPenilaianKriteria (lihat penilaian kriteria yg dipilih)   (done)

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { Anggota, Pemilihan, Periode, DetailPemilihan, DataNilai, Voting1, Voting2, Indikator, sequelize } = require("../models");
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

    console.log("Pemilihan: ", JSON.stringify(pemilihan, null, 2));

    let role = req.cookies.role;
    const akun = req.user;

    console.log("Akun: ", JSON.stringify(akun, null, 2));

    if (!pemilihan || akun.status_anggota === "nonaktif") {
      statusnya = false;
      console.log("Tidak ada pemilihan yang sedang berjalan.");
      return res.render("user/voting", {
        title: "Voting",
        layout: "layouts/layout",
        pemilihan,
        akun,
        statusnya,
        role,
      });
    }
    let detail_pemilihan = await DetailPemilihan.findOne({
      where: {
        pemilihan_id: pemilihan.pemilihan_id,
        anggota_id: akun.nip,
      },
    });

    console.log("Detail Pemilihan: ", JSON.stringify(detail_pemilihan, null, 2));

    if (!detail_pemilihan) {
      statusnya = false;
      console.log("Anda tidak terdaftar dalam pemilihan ini.");
      return res.render("user/voting", {
        title: "Voting",
        layout: "layouts/layout",
        pemilihan,
        akun,
        statusnya,
        role,
      });
    } else {
      let detail_voting1 = await Voting1.findOne({
        where: {
          detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
        },
      });
      if (detail_voting1) {
        return res.redirect("/users/pemilihan/hasil-voting");
      }
      statusnya = true;
      // buat ambil role dari cookie
      let role = req.cookies.role;
      const data_nilai = await DataNilai.findAll({
        where: { 
          status_anggota: "eligible",
          "$DetailPemilihan.pemilihan_id$": pemilihan.pemilihan_id,
         },
         include: [
          {
            model: DetailPemilihan,
            required: true,
            where: {
              pemilihan_id: pemilihan.pemilihan_id,
            },
          },
        ],
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

      return res.render("user/voting", {
        title: "Voting",
        layout: "layouts/layout",
        role,
        data_nilai,
        akun,
        statusnya,
        pemilihan,
      });
    }
  } catch (error) {
    console.error("getKandidatVot1 validation error:", error);
    // res.redirect("/users/beranda");
    next(error);
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
    const kandidatKriteria = [];
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: { [Op.ne]: "tutup" },
      },
      order: [["tanggal_mulai", "DESC"]],
    });

    console.log("\n\nPemilihan: ", JSON.stringify(pemilihan, null, 2));

    let role = req.cookies.role;
    const akun = req.user;

    let jmlKandidat = 0;

    if (pemilihan) {
      jmlKandidat = await Voting1.count({
        where: {
          status_anggota: "lolos",
          "$DetailPemilihan.pemilihan_id$": pemilihan.pemilihan_id,
        },
        include: [
          {
            model: DetailPemilihan,
            required: true,
          }
        ],
      });
    }

    console.log("\n\nJumlah kandidat yang lolos: " + jmlKandidat + "\n\n");

    if (!pemilihan || akun.status_anggota == "nonaktif" || jmlKandidat === 0 || pemilihan.tahap_pemilihan === "voting1") {
      statusnya = true;
      return res.render("user/penilaian_kriteria", {
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
      if (!detail_pemilihan) {
        statusnya = true;
        return res.render("user/penilaian_kriteria", {
          title: "Penilaian Kriteria",
          layout: "layouts/layout",
          pemilihan,
          statusnya,
          akun,
          role,
        });
      }
      let detail_voting2 = await Voting2.findOne({
        where: {
          detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
        },
      });

      let mengisiVot1 = await Voting1.findOne({
        where: {
          detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
          },
      });
      
      if (detail_voting2 || pemilihan.tahap_pemilihan === "selesai") {
        return res.redirect("/users/pemilihan/thank-you");
      } else {
        let inditakor = await Indikator.findAll({
          where: {
            status_inditakor: "aktif",
          },
        });
        // buat ambil role dari cookie
        let role = req.cookies.role;

        let anggota = await Anggota.findAll({
          where: {
            status_anggota: "aktif",
          },
        });

        for (let i = 0; i < anggota.length; i++) {
          let kandidat_voting1 = await DetailPemilihan.findOne({
            where: {
              pemilihan_id: pemilihan.pemilihan_id,
              anggota_id: anggota[i].nip,
            },
          });

          if (!kandidat_voting1) continue; // Jika tidak ditemukan, lanjut ke iterasi berikutnya

          let anggota_lulus = await Voting1.findOne({
            where: {
              detail_pemilihan_id: kandidat_voting1.detail_pemilihan_id,
              status_anggota: "lolos",
            },
          });

          if (anggota_lulus) {
            console.log("++++++++++ " + anggota_lulus.detail_pemilihan_id);

            // Tambahkan objek kandidat ke dalam array
            kandidatKriteria.push({
              detail_pemilihan_id: anggota_lulus.detail_pemilihan_id,
              anggota_id: anggota[i].nip, // Menyimpan ID anggota agar lebih informatif
              skor: 0, // Inisialisasi skor (jika perlu dihitung nanti)
            });

            console.log("----------- " + anggota_lulus.detail_pemilihan_id);
            console.log("=========== Panjang kandidatKriteria: " + kandidatKriteria.length);
          } else {
            console.log("gaada " + i);
          }
        }
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
          let foto_kandidat = nama_lulus.foto;
          if (!foto_kandidat || !fs.existsSync(path.join(__dirname, '../public', foto_kandidat)) && !foto_kandidat.toLowerCase().includes('http')) {
            const defaultPath = '/default_pp/';
            foto_kandidat = defaultPath + (nama_lulus.gender === 'wanita' ? 'pr.png' : 'lk.png');
          };
          kandidatKriteria[i].foto = foto_kandidat;
        }
        res.render("user/penilaian_kriteria", {
          title: "Penilaian Kriteria",
          layout: "layouts/layout",
          inditakor,
          role,
          akun,
          kandidatKriteria,
          pemilihan,
        });
      }
    }
  } catch (error) {
    console.error("getKandidatKriteria validation error:", error);
    // res.redirect("/users/beranda");
    next(error);
  }
};

const setPenilaianKriteria = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    // Get pemilihan aktif
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting2",
      },
      order: [["tanggal_mulai", "DESC"]],
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
      },
    });

    if (!detail_pemilihan) {
      throw new Error("Detail pemilihan tidak ditemukan.");
    }

    // Get semua kandidat yang lolos
    let kandidatKriteria = await Voting1.findAll({
      where: {
        status_anggota: "lolos",
        "$DetailPemilihan.pemilihan_id$": pemilihan.pemilihan_id,
      },
      include: [
        {
          model: DetailPemilihan,
          required: true,
          include: [
            {
              model: Anggota,
              attributes: ["nip", "nama"],
            },
          ],
        },
      ],
    });

    // Get semua indikator aktif
    let indikatorList = await Indikator.findAll({
      where: {
        status_inditakor: "aktif",
      },
      order: [["indikator_id", "ASC"]],
    });

    console.log("\nData yang akan diproses:");
    console.log("Jumlah kandidat:", kandidatKriteria.length);
    console.log("Jumlah indikator:", indikatorList.length);

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
          Voting2.create(
            {
              detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
              indikator_id: indikatorList[i].indikator_id,
              kandidat_id: kandidat.DetailPemilihan.anggota_id,
              nilai: nilai,
              waktu_vot2: new Date(),
            },
            { transaction }
          )
        );
      }
    }

    // Simpan semua penilaian
    await Promise.all(penilaianPromises);
    await transaction.commit();

    console.log("\nSemua penilaian berhasil disimpan");
    res.redirect("/users/pemilihan/thank-you");
  } catch (error) {
    await transaction.rollback();
    console.error("setPenilaianKriteria error:", error);
    // res.redirect("/users/beranda");
    next(error);
  }
};

const getMyPenilaianKriteria = async (req, res, next) => {
  try {
    let pemilihan = await Pemilihan.findOne({
      where: {
        [Op.or]: [
          {tahap_pemilihan: "voting2"},
          {tahap_pemilihan: "selesai"},
          ],
      },
      order: [["tanggal_mulai", "DESC"]],
      include: [
        {
          model: Periode,
          required: true,
        },
      ],
    });

    let statusPemilihan = pemilihan.tahap_pemilihan;
    let pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} ${pemilihan.tahun} - ${statusPemilihan === 'selesai' ? 'Pemilihan Terakhir' : 'Pemilihan Saat Ini'}`;
    

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

    console.log("Waktu voting: ", JSON.stringify(waktu_voting, null, 2));

    let role = req.cookies.role;
    let pesan = '';

    if (!waktu_voting) {
      pesan = 'Anda tidak melakukan penilaian kriteria.';
    }

    console.log("Pesan: ", pesan);

    res.render("user/thank-you", {
      title: "Thank You",
      layout: "layouts/layout",
      role,
      akun,
      pemilihanTitle,
      waktu_voting,
      pesan,
    });
  } catch (error) {
    console.error("getMyVot validation error:", error);
    // res.redirect("/users/beranda");
    next(error);
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
