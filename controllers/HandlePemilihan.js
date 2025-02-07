// HandlePemilihan

// - getActivePemilihan (untuk halaman pemilihan berlangsung)   (done)
// - getInputPenilaian (untuk halaman input penilaian)          (done)
// - createDataPenilaian (post excel template)
// - getAllDataPenilaian (hasil penilaian)
// - getAllKandidatEligible (halaman kandidat eligible)
// - getHasilKriteria (tabel nilai akhir)
// - getPegawaiTerbaik (bisa juga pakai controller user)

const { Pemilihan, Periode } = require('../models');
const { Op } = require('sequelize');

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

module.exports = {
  getActivePemilihan,
  getInputPenilaian,
};