// AdminMainController

// - getDashboardAdmin (utk dashboard)            (done)
// - getRiwayatPemilihan (utk riwayat pemilihan)  (done)
// - getDetailRiwayat (utk detail riwayat)        (done)

const { 
  Anggota, 
  DataNilai, 
  Voting1, 
  Voting2, 
  Indikator,
  Pemilihan,
  Periode,
  DetailPemilihan,
  sequelize 
} = require('../models');
const { Op } = require('sequelize');

// Get dashboard admin
const getDashboardAdmin = async (req, res, next) => {
  try {
    // Get pemilihan terbaru dengan periode
    const pemilihanAktif = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: {
          [Op.ne]: 'tutup'
        }
      },
      include: [{ model: Periode }],
      order: [['tanggal_mulai', 'DESC']]
    });

    if (!pemilihanAktif) {
      return res.render('admin/dashboard', {
        title: 'Dashboard Admin',
        layout: 'layouts/admin.hbs',
        totalAnggota: 0,
        kandidatEligible: 0,
        kandidatTahap1: 0,
        totalKriteria: 0,
        progressData: {
          totalPartisipan: 0,
          progressInputNilai: 0,
          progressVoting1: 0,
          progressVoting2: 0
        },
        pemilihanTitle: 'Tidak ada pemilihan',
        akun: req.user,
      });
    }

    const pemilihanTitle = `${pemilihanAktif.nama_pemilihan} ${pemilihanAktif.Periode.nama_periode} Tahun ${pemilihanAktif.tahun}`;

    // Get total anggota dari detail pemilihan
    const totalAnggota = await DetailPemilihan.count({
      where: { 
        pemilihan_id: pemilihanAktif.pemilihan_id 
      },
      include: [{
        model: Anggota,
        where: {
          role: { [Op.ne]: 'admin' },
        }
      }]
    });

    const partisipan = await Anggota.count({
      where: {
        role: { [Op.ne]: 'admin' },
        status_anggota: 'aktif',
      }    
    });    

    // Get jumlah kandidat eligible untuk pemilihan terbaru
    const kandidatEligible = await DetailPemilihan.count({
      where: { pemilihan_id: pemilihanAktif.pemilihan_id },
      include: [{
        model: DataNilai,
        required: true,
        where: {
          status_anggota: 'eligible'
        }
      }]
    });

    // Get jumlah kandidat lolos tahap 1 untuk pemilihan terbaru
    const kandidatTahap2 = await DetailPemilihan.count({
      where: { pemilihan_id: pemilihanAktif.pemilihan_id },
      include: [{
        model: Voting1,
        required: true,
        where: {
          status_anggota: 'lolos'
        }
      }]
    });

    // Get total kriteria aktif
    const totalKriteria = await Indikator.count({
      where: {
        status_inditakor: 'aktif'
      }
    });

    // Get progress data
    // Get jumlah yang sudah input nilai
    const sudahInputNilai = await DetailPemilihan.count({
      where: { pemilihan_id: pemilihanAktif.pemilihan_id },
      include: [{
        model: DataNilai,
        required: true
      }]
    });

    // Get jumlah yang sudah voting 1
    let sudahVoting1 = await DetailPemilihan.count({
      where: { pemilihan_id: pemilihanAktif.pemilihan_id },
      include: [{
        model: Voting1,
        required: true
      }, {
        model: Anggota,
        where: {
          role: { [Op.ne]: 'admin' },
          status_anggota: 'aktif'
        }
      }]
    });

    // Get jumlah yang sudah voting 2
    let sudahVoting2 = await DetailPemilihan.count({
      where: { pemilihan_id: pemilihanAktif.pemilihan_id },
      include: [{
        model: Voting2,
        required: true
      }, {
        model: Anggota,
        where: {
          role: { [Op.ne]: 'admin' },
          status_anggota: 'aktif'
        }
      }],
      distinct: true
    });

    // Normalisasi jumlah voting 1 dan 2
    sudahVoting1 = Math.min(sudahVoting1, partisipan);
    sudahVoting2 = Math.min(sudahVoting2, partisipan);

    const progressData = {
      totalPartisipan: totalAnggota,
      progressInputNilai: Math.min(100, Math.round((sudahInputNilai / totalAnggota) * 100)),
      progressVoting1: Math.min(100, Math.round((sudahVoting1 / partisipan) * 100)),
      progressVoting2: Math.min(100, Math.round((sudahVoting2 / partisipan) * 100)),
    };

    // console.log('\nData Dashboard:');
    // console.log(JSON.stringify({
    //   pemilihanTitle,
    //   totalAnggota,
    //   kandidatEligible,
    //   kandidatTahap1,
    //   totalKriteria,
    //   progressData
    // }, null, 2));

    res.render('admin/dashboard', {
      title: 'Dashboard Admin',
      layout: 'layouts/admin.hbs',
      totalAnggota : partisipan,
      kandidatEligible,
      kandidatTahap2,
      totalKriteria,
      progressData,
      pemilihanTitle,
      akun: req.user,
    });

  } catch (error) {
    console.error('Error getting dashboard data:', error);
    next(error);
  }
};

// Get riwayat pemilihan
const getRiwayatPemilihan = async (req, res, next) => {
  try {
    // Get semua periode untuk filter
    const periodeList = await Periode.findAll({
      attributes: ['periode_id', 'nama_periode'],
      order: [['periode_id', 'ASC']]
    });

    // Get tahun unik dari pemilihan untuk filter
    const tahunList = await Pemilihan.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('tahun')), 'tahun']],
      order: [['tahun', 'DESC']]
    });

    const { periode_id, tahun } = req.query;

    // Convert string parameters to arrays
    const selectedPeriodes = periode_id ? periode_id.split(',') : [];
    const selectedTahun = tahun ? tahun.split(',') : [];

    // Apply filter
    let whereClause = {
      tahap_pemilihan: {
        [Op.in]: ['selesai', 'tutup']
      }
    };

    if (selectedPeriodes.length > 0) {
      whereClause.periode_id = {
        [Op.in]: selectedPeriodes
      };
    }

    if (selectedTahun.length > 0) {
      whereClause.tahun = {
        [Op.in]: selectedTahun
      };
    }

    const riwayatPemilihan = await Pemilihan.findAll({
      where: whereClause,
      include: [{ 
        model: Periode,
        attributes: ['nama_periode']
      }],
      order: [['tanggal_mulai', 'DESC']]
    });

    // Get pemenang untuk setiap pemilihan yang selesai
    const riwayatData = await Promise.all(riwayatPemilihan.map(async (pemilihan) => {
      let pemenangData = null;

      if (pemilihan.tahap_pemilihan === 'selesai') {
        // Get jumlah indikator dan pengisi
        const jumlahIndikator = await Voting2.count({
          where: { 
            '$DetailPemilihan.pemilihan_id$': pemilihan.pemilihan_id 
          },
          include: [{
            model: DetailPemilihan,
            required: true,
            attributes: []
          }],
          distinct: true,
          col: 'indikator_id'
        });

        const jumlahPengisi = await DetailPemilihan.count({
          where: { pemilihan_id: pemilihan.pemilihan_id },
          include: [{
            model: Voting2,
            required: true
          }],
          distinct: true
        });

        // Get semua kandidat yang lolos
        const kandidat = await DetailPemilihan.findAll({
          where: { 
            pemilihan_id: pemilihan.pemilihan_id,
            '$Voting1.status_anggota$': 'lolos'
          },
          include: [
            {
              model: Anggota,
              attributes: ['nip', 'nama', 'gender', 'foto']
            },
            {
              model: Voting1,
              required: true,
              where: { status_anggota: 'lolos' }
            }
          ]
        });

        // Hitung nilai untuk setiap kandidat
        const hasilKriteria = await Promise.all(kandidat.map(async (k) => {
          const totalPoin = await Voting2.sum('nilai', {
            where: { 
              kandidat_id: k.anggota_id,
              '$DetailPemilihan.pemilihan_id$': pemilihan.pemilihan_id,
            },
            include: [{
              model: DetailPemilihan,
              required: true,
              attributes: []
            }],
          });

          const rataRata = ((totalPoin / jumlahPengisi) / (jumlahIndikator * 4)) * 100;

          return {
            nama: k.Anggotum.nama,
            foto: k.Anggotum.foto || 
                  (k.Anggotum.gender === 'pria' ? '/default_pp/lk.png' : '/default_pp/pr.png'),
            rataRata: parseFloat(rataRata.toFixed(2))
          };
        }));

        // Sort dan ambil nilai tertinggi
        hasilKriteria.sort((a, b) => b.rataRata - a.rataRata);
        pemenangData = hasilKriteria[0];
      }

      return {
        id: pemilihan.pemilihan_id,
        title: `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} Tahun ${pemilihan.tahun}`,
        tanggal: new Date(pemilihan.tanggal_mulai).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        status: pemilihan.tahap_pemilihan,
        pemenang: pemenangData
      };
    }));

    res.render('admin/riwayat_pemilihan/riwayat_pemilihan', {
      title: 'Riwayat Pemilihan',
      layout: 'layouts/admin.hbs',
      riwayatPemilihan: riwayatData,
      periodeList,
      tahunList: tahunList.map(t => t.tahun),
      selectedPeriode: selectedPeriodes,
      selectedTahun: selectedTahun,
      akun: req.user,
    });

  } catch (error) {
    console.error('Error getting riwayat pemilihan:', error);
    next(error);
  }
};

// Detail Riwayat Pemilihan
const getDetailRiwayat = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data dengan periode
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{ model: Periode }]
    });

    if (!pemilihan) {
      return res.status(404).redirect('/admin/riwayat_pemilihan');
    }

    const pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} Tahun ${pemilihan.tahun}`;

    // Get jumlah indikator aktif
    const jumlahIndikator = await Voting2.count({
      where: { 
        '$DetailPemilihan.pemilihan_id$': id 
      },
      include: [{
        model: DetailPemilihan,
        required: true,
        attributes: []
      }],
      distinct: true,
      col: 'indikator_id'
    });

    // Get jumlah pengisi penilaian
    const jumlahPengisi = await DetailPemilihan.count({
      where: { pemilihan_id: id },
      include: [{
        model: Voting2,
        required: true
      }],
      distinct: true
    });

    // Get kandidat yang lolos
    const kandidat = await DetailPemilihan.findAll({
      where: { 
        pemilihan_id: id,
        '$Voting1.status_anggota$': 'lolos'
      },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama']
        },
        {
          model: Voting1,
          required: true,
          where: { status_anggota: 'lolos' }
        }
      ]
    });

    // Hitung nilai untuk setiap kandidat
    const hasilKriteria = await Promise.all(kandidat.map(async (k) => {
      const totalPoin = await Voting2.sum('nilai', {
        where: { 
          kandidat_id: k.anggota_id,
          '$DetailPemilihan.pemilihan_id$': id,
        },
        include: [{
          model: DetailPemilihan,
          required: true,
          attributes: []
        }]
      });

      // Hitung rata-rata
      // ((total poin / jumlah pengisi) / (jumlah kriteria * 4)) * 100
      const rataRata = ((totalPoin / jumlahPengisi) / (jumlahIndikator * 4)) * 100;

      return {
        nama: k.Anggotum.nama,
        nip: k.Anggotum.nip,
        totalPoin,
        rataRata: parseFloat(rataRata.toFixed(2))
      };
    }));

    // Sort berdasarkan rata-rata tertinggi
    hasilKriteria.sort((a, b) => b.rataRata - a.rataRata);

    // Add posisi/ranking
    const hasilKriteriaFinal = hasilKriteria.map((hasil, index) => ({
      ...hasil,
      no: index + 1
    }));

    // console.log('\nDetail Riwayat:');
    // console.log(JSON.stringify({
    //   pemilihanTitle,
    //   hasil: hasilKriteriaFinal
    // }, null, 2));

    res.render('admin/riwayat_pemilihan/detail_riwayat', {
      title: 'Detail Riwayat Pemilihan',
      layout: 'layouts/admin.hbs',
      pemilihanTitle,
      idPemilihan: id,
      hasilKriteria: hasilKriteriaFinal,
      akun: req.user
    });

  } catch (error) {
    console.error('Error getting detail riwayat:', error);
    next(error);
  }
};

module.exports = {
  getDashboardAdmin,
  getRiwayatPemilihan,
  getDetailRiwayat,
};