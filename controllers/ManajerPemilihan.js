// ManajerPemilihan

// - getAllPemilihan (done)
// - getBuatPemilihan (done)
// - createPemilihan (done)
// - closePemilihan  (done)
// - deletePemilihan (done)

const { Pemilihan, 
        Periode, 
        Anggota, 
        DetailPemilihan, 
        Voting1, 
        Voting2, 
        DataNilai,
        sequelize } = require('../models');
const { Op } = require('sequelize');

// get all pemilihan data
const getAllPemilihan = async (req, res, next) => {
  try {
    // Get active pemilihan count
    const activePemilihan = await Pemilihan.count({
      where: {
        tahap_pemilihan: {
          [Op.notIn]: ['tutup', 'selesai']
        }
      }
    });

    // Get completed pemilihan count
    const completedPemilihan = await Pemilihan.count({
      where: {
        tahap_pemilihan: 'selesai'
      }
    });

    // Get active anggota count
    const activeAnggota = await Anggota.count({
      where: {
        [Op.and]: [
          { status_karyawan: 'aktif' },
          { role: { [Op.ne]: 'admin' } }
        ]
      }
    });

    // Get all pemilihan data
    const dataPemilihan = await Pemilihan.findAll({
      include: [{
        model: Periode,
        attributes: ['nama_periode']
      }],
      order: [['tanggal_mulai', 'DESC']]
    });

    res.render('admin/manajemen_pemilihan/pemilihan', {
      title: 'Manajemen Pemilihan',
      layout: 'layouts/admin.hbs',
      activePemilihan,
      completedPemilihan,
      activeAnggota,
      dataPemilihan: dataPemilihan.map(p => ({
        ...p.toJSON(),
        periode: p.Periode.nama_periode,
        tanggalMulai: new Date(p.tanggal_mulai).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        status: p.tahap_pemilihan
      })),
      akun: req.user,
    });

  } catch (error) {
    next(error);
  }
};

// mendapatkan data untuk halaman buat pemilihan
const getBuatPemilihan = async (req, res, next) => {
  try {
    const periode = await Periode.findAll({
      order: [['periode_id', 'ASC']]
    });

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    res.render('admin/manajemen_pemilihan/buat_pemilihan', { 
      title: 'Buat Pemilihan',
      layout: 'layouts/admin.hbs',
      periode,
      years,
      akun: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// membuat pemilihan
const createPemilihan = async (req, res, next) => {
  try {
    const { namaPemilihan, tahun, periode, tanggalMulai } = req.body;

    // Validasi input
    if (!namaPemilihan || !tahun || !periode || !tanggalMulai) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }

    // Create pemilihan
    const newPemilihan = await Pemilihan.create({
      nama_pemilihan: namaPemilihan,
      periode_id: parseInt(periode),
      tahun: parseInt(tahun),
      tanggal_mulai: new Date(tanggalMulai),
      tahap_pemilihan: 'datanilai'
    });

    // Get all active non-admin anggota
    const activeAnggota = await Anggota.findAll({
      where: { role: { [Op.ne]: 'admin' } }
    });

    // Create detail_pemilihan for each anggota
    await DetailPemilihan.bulkCreate(
      activeAnggota.map(ang => ({
        pemilihan_id: newPemilihan.pemilihan_id,
        anggota_id: ang.nip
      }))
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating pemilihan:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// tutup pemilihan
const closePemilihan = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Update status pemilihan
    await Pemilihan.update(
      { tahap_pemilihan: 'tutup' },
      { where: { pemilihan_id: id } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error closing pemilihan:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// hapus pemilihan
const deletePemilihan = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Find detail pemilihan ids
    const detailPemilihanIds = await DetailPemilihan.findAll({
      where: { pemilihan_id: id },
      attributes: ['detail_pemilihan_id']
    });

    const ids = detailPemilihanIds.map(d => d.detail_pemilihan_id);

    // Delete related records
    await Promise.all([
      // Delete voting data
      Voting1.destroy({
        where: { detail_pemilihan_id: { [Op.in]: ids } },
        transaction
      }),
      Voting2.destroy({
        where: { detail_pemilihan_id: { [Op.in]: ids } },
        transaction
      }),
      // Delete nilai data
      DataNilai.destroy({
        where: { detail_pemilihan_id: { [Op.in]: ids } },
        transaction
      }),
      // Delete detail pemilihan
      DetailPemilihan.destroy({
        where: { pemilihan_id: id },
        transaction
      }),
      // Delete pemilihan
      Pemilihan.destroy({
        where: { pemilihan_id: id },
        transaction
      })
    ]);

    await transaction.commit();
    res.status(200).json({ success: true });

  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting pemilihan:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
    getAllPemilihan,
    getBuatPemilihan,
    createPemilihan,
    closePemilihan,
    deletePemilihan,
};