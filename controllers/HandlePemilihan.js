// HandlePemilihan

// - getActivePemilihan (untuk halaman pemilihan berlangsung)   (done)
// - getInputPenilaian (untuk halaman input penilaian)          (done)
// - createDataPenilaian (post excel template)                  (done)
// - getAllDataPenilaian (hasil penilaian)                      (done)
// - getAllKandidatEligible (halaman kandidat eligible)         (done)
// - getHasilKriteria (tabel nilai akhir)
// - getPegawaiTerbaik (bisa juga pakai controller user)

const { Pemilihan, 
        DetailPemilihan, 
        DataNilai, 
        Anggota, 
        Periode,
        sequelize 
      } = require('../models');
const { Op } = require('sequelize');

// Get active pemilihan
const getActivePemilihan = async (req, res, next) => {
  try {
    // Get active pemilihan
    const activePemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: {
          [Op.ne]: 'tutup'
        }
      },
      include: [{
        model: Periode,
        attributes: ['nama_periode']
      }],
      order: [
        ['tahap_pemilihan', 'DESC'], // selesai akan tampil terakhir
        ['tanggal_mulai', 'DESC']
      ]
    });

    let title = 'Tidak ada pemilihan yang sedang berlangsung';
    let tahapPemilihan = null;
    let idActivePemilihan = null;

    if (activePemilihan) {
      idActivePemilihan = activePemilihan.pemilihan_id;
      title = `${activePemilihan.nama_pemilihan} ${activePemilihan.Periode.nama_periode} ${activePemilihan.tahun}`;
      tahapPemilihan = activePemilihan.tahap_pemilihan;
    }

    res.render('admin/pemilihan_berlangsung/pemilihan_berlangsung', {
      title: 'Pemilihan Berlangsung',
      layout: 'layouts/admin.hbs',
      pemilihanTitle: title,
      tahapPemilihan: tahapPemilihan,
      idActivePemilihan,
      akun: req.user,
    });

  } catch (error) {
    console.error('Error getting active pemilihan:', error);
    next(error);
  }
};

// Get input penilaian
const getInputPenilaian = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{
        model: Periode,
        attributes: ['nama_periode']
      }]
    });

    if (!pemilihan) {
      return res.status(404).redirect('/admin/pemilihan_berlangsung');
    }

    const pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} ${pemilihan.tahun}`;

    res.render('admin/pemilihan_berlangsung/input_penilaian', {
      title: 'Input Penilaian',
      layout: 'layouts/admin.hbs',
      pemilihanTitle,
      pemilihan_id: id,
      akun: req.user
    });

  } catch (error) {
    console.error('Error getting input penilaian page:', error);
    next(error);
  }
};

// Create data penilaian
const createDataPenilaian = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    let rekapData;

    try {
      rekapData = JSON.parse(req.body.rekapData);
      console.log('\nData rekap yang diterima:');
      console.log(JSON.stringify(rekapData, null, 2));
    } catch (parseError) {
      console.error('Error parsing rekapData:', parseError);
      return res.status(400).json({ 
        success: false, 
        message: 'Format data tidak valid' 
      });
    }

    // Get detail pemilihan dengan existing data nilai
    const detailPemilihan = await DetailPemilihan.findAll({
      where: { pemilihan_id: id },
      include: [
        { 
          model: Anggota,
          attributes: ['nip', 'nama']
        },
        {
          model: DataNilai,
          required: false // Left join untuk dapat semua detail pemilihan
        }
      ]
    });

    console.log('\nDetail Pemilihan dengan Data Nilai:');
    console.log(JSON.stringify(detailPemilihan, null, 2));

    // Process each anggota's score
    const updatePromises = rekapData.map(async (rekap) => {
      const detail = detailPemilihan.find(d => d.Anggotum.nip === rekap.nip);
      
      if (!detail) {
        console.log(`\nSkip data untuk NIP: ${rekap.nip} (tidak ditemukan)`);
        return;
      }

      // Parse nilai
      const tl1 = parseInt(rekap.tl1) || 0;
      const tl2 = parseInt(rekap.tl2) || 0;
      const tl3 = parseInt(rekap.tl3) || 0;
      const tl4 = parseInt(rekap.tl4) || 0;
      const psw1 = parseInt(rekap.psw1) || 0;
      const psw2 = parseInt(rekap.psw2) || 0;
      const psw3 = parseInt(rekap.psw3) || 0;
      const psw4 = parseInt(rekap.psw4) || 0;
      const avgCkp = parseFloat(rekap.avgCkp) || 0;

      // Calculate scores
      const scoreAbsen = (
        (tl1 * -0.25) + 
        (tl2 * -0.5) + 
        (tl3 * -0.75) + 
        (tl4 * -1) +
        (psw1 * -0.25) + 
        (psw2 * -0.5) + 
        (psw3 * -0.75) + 
        (psw4 * -1)
      );

      const totalScore = (avgCkp / 100 * 20) + (80 + scoreAbsen);
      
      console.log(`\nProses data untuk NIP: ${rekap.nip}`);
      console.log(`Status: ${detail.DataNilai ? 'Update' : 'Create New'}`);
      console.log(`Score CKP: ${avgCkp}`);
      console.log(`Score Absen: ${scoreAbsen}`);
      console.log(`Total Score: ${totalScore}`);

      if (detail.DataNilai) {
        // Update existing data
        return DataNilai.update({
          score_ckp: avgCkp,
          score_absen: scoreAbsen,
          score_akhir: totalScore,
          status_anggota: totalScore >= 99.80 ? 'eligible' : 'non_eligible'
        }, {
          where: { detail_pemilihan_id: detail.detail_pemilihan_id },
          transaction
        });
      } else {
        // Create new data
        return DataNilai.create({
          detail_pemilihan_id: detail.detail_pemilihan_id,
          score_ckp: avgCkp,
          score_absen: scoreAbsen,
          score_akhir: totalScore,
          status_anggota: totalScore >= 99.80 ? 'eligible' : 'non_eligible'
        }, { transaction });
      }
    });

    await Promise.all(updatePromises);
    await transaction.commit();

    console.log('\nBerhasil menyimpan semua data nilai');
    res.redirect(`/admin/pemilihan_berlangsung/${id}/hasil_penilaian`);

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating data penilaian:', error);
    next(error);
  }
};

// Get all data penilaian
const getAllDataPenilaian = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { search, status } = req.query;

    // Get selected status dari query params
    const selectedStatus = status ? status.split(',') : [];

    // Get pemilihan data
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{
        model: Periode,
        attributes: ['nama_periode']
      }]
    });

    if (!pemilihan) {
      return res.status(404).redirect('/admin/pemilihan_berlangsung');
    }

    const pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} ${pemilihan.tahun}`;

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { '$Anggotum.nama$': { [Op.like]: `%${search}%` } },
          { '$Anggotum.nip$': { [Op.like]: `%${search}%` } }
        ]
      };
    }

    if (status) {
      whereClause['$DataNilai.status_anggota$'] = status;
    }

    const dataPenilaian = await DetailPemilihan.findAll({
      where: { 
        pemilihan_id: id,
        ...whereClause
      },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama', 'jabatan']
        },
        {
          model: DataNilai,
          required: true
        }
      ],
      order: [
        ['DataNilai', 'score_akhir', 'DESC']
      ],
    });

    // Get count per status
    const statusCounts = await DetailPemilihan.findAll({
      where: { pemilihan_id: id },
      include: [{
        model: DataNilai,
        required: true,
        attributes: ['status_anggota']
      }],
      attributes: [
        [sequelize.col('DataNilai.status_anggota'), 'status_anggota'],
        [sequelize.fn('COUNT', sequelize.col('DetailPemilihan.detail_pemilihan_id')), 'count']
      ],
      group: ['DataNilai.status_anggota']
    });

    console.log('\nStatus Counts:');
    console.log(JSON.stringify(statusCounts, null, 2));

    // Format status untuk filter
    const filterStatus = [
      { 
        id: 'eligible',
        label: 'Memenuhi',
        count: statusCounts.find(s => s.get('status_anggota') === 'eligible')?.get('count') || 0
      },
      {
        id: 'non_eligible',
        label: 'Tidak Memenuhi',
        count: statusCounts.find(s => s.get('status_anggota') === 'non_eligible')?.get('count') || 0
      }
    ];

    console.log('\nFilter Status:');
    console.log(JSON.stringify(filterStatus, null, 2));

    console.log('\nData Penilaian:');
    console.log(JSON.stringify(dataPenilaian, null, 2));

    res.render('admin/pemilihan_berlangsung/hasil_penilaian', {
      title: 'Hasil Penilaian',
      layout: 'layouts/admin.hbs',
      pemilihanTitle,
      dataPenilaian,
      idPemilihan: id,
      search,
      status,
      filterStatus,
      selectedStatus,
      akun: req.user,
    });

  } catch (error) {
    console.error('Error getting data penilaian:', error);
    next(error);
  }
};

// Get kandidat eligible
const getAllKandidatEligible = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data dengan periode
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{
        model: Periode,
        attributes: ['nama_periode']
      }]
    });

    if (!pemilihan) {
      return res.status(404).redirect('/admin/pemilihan_berlangsung');
    }

    const pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} ${pemilihan.tahun}`;

    // Get kandidat eligible
    const kandidatEligible = await DetailPemilihan.findAll({
      where: { 
        pemilihan_id: id,
        '$DataNilai.status_anggota$': 'eligible'
      },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama', 'jabatan']
        },
        {
          model: DataNilai,
          required: true
        }
      ],
      order: [
        ['DataNilai', 'score_akhir', 'DESC'],
        ['Anggotum', 'nip', 'ASC'],
      ]
    });

    console.log('\nData Kandidat Eligible:');
    console.log(JSON.stringify(kandidatEligible, null, 2));

    res.render('admin/pemilihan_berlangsung/hasil_kandidat', {
      title: 'Kandidat Eligible',
      layout: 'layouts/admin.hbs',
      pemilihanTitle,
      kandidatEligible,
      idPemilihan: id,
      akun: req.user
    });

  } catch (error) {
    console.error('Error getting kandidat eligible:', error);
    next(error);
  }
};

module.exports = {
  getActivePemilihan,
  getInputPenilaian,
  createDataPenilaian,
  getAllDataPenilaian,
  getAllKandidatEligible,
};