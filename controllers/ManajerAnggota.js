// ManajerAnggota

// - getAllAnggota      (done)
// - createAnggota      (done)
// - getOneAnggota (utk detail & edit)  (done)
// - editAnggota    (utk proses edit & ubah password) (done)
// - getAnggotaToChangePassword         (done)
// - deleteAnggota      (done)

const { Anggota, Pemilihan, DetailPemilihan, Sequelize } = require('../models');
const { Op } = Sequelize;
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const timList = [
  "Kepala BPS Kota Padang",
  "Statistik Pertanian",
  "Statistik Industri dan Pertambangan Energi dan kontruksi",
  "Statistik Kesejahteraan Rakyat dan Ketahanan Sosial", 
  "Statistik Ketenagakerjaan",
  "Pengolahan",
  "Diseminasi dan Teknologi Informasi",
  "Statistik Neraca Produksi",
  "Statistik Neraca Pengeluaran dan Analisis",
  "Statistik Distribusi",
  "Pariwisata dan profiling Statistical Business Register (SBR)",
  "Statistik Harga",
  "Pembinaan Statistik Sektoral",
  "Reformasi Birokrasi, Zona Integritas dan Indikator Strategis",
  "Kasubag Umum",
  "Sub Tim SAKIP",
  "Sub Tim Humas, PPID dan Manajemen Mitra",
  "Sub Tim EPSS"
];

// Get all anggota
const getAllAnggota = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const selectedDivisi = req.query.divisi ? req.query.divisi.split(',') : [];
    
    let whereClause = {
      // Tambah filter untuk exclude admin
      role: { [Op.ne]: 'admin' }
    };

    if (search) {
      whereClause[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { nip: { [Op.like]: `%${search}%` } },
      ];
    }
    
    if (selectedDivisi.length > 0) {
      whereClause.divisi = { [Op.in]: selectedDivisi }; 
    }

    const { count, rows: dataAnggota } = await Anggota.findAndCountAll({
      where: whereClause,
      order: [
        ['divisi', 'ASC'],
        ['nama', 'ASC']
      ]
    });

    // Get divisi with count (exclude admin)
    const divisiWithCount = await Anggota.findAll({
      where: {
        role: { [Op.ne]: 'admin' }
      },
      attributes: [
        'divisi',
        [Sequelize.fn('COUNT', Sequelize.col('nip')), 'count']
      ],
      group: ['divisi'],
      raw: true
    });

    res.render('admin/manajemen_anggota/manajemen_anggota', { 
      title: 'Manajemen Anggota',
      layout: 'layouts/admin.hbs',
      dataAnggota: dataAnggota.map(a => ({
        ...a.dataValues,
        status: a.status_anggota === 'aktif' // Convert status to boolean
      })),
      divisiList: divisiWithCount.map(d => ({
        divisi: d.divisi,
        count: d.count
      })),
      search,
      totalData: count,
      selectedDivisi,
      akun: req.user
    });
  } catch (error) {
    next(error);
  }
};

// Get one anggota
const getOneAnggota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const anggota = await Anggota.findByPk(id);
    
    if (!anggota) {
      return res.redirect('/admin/manajemen_anggota');
    }

    // Set foto profil default berdasarkan jenis kelamin
    let fotoProfil = anggota.foto;
    if (!fotoProfil) {
      const defaultPath = '/default_pp/';
      fotoProfil = defaultPath + (anggota.gender === 'wanita' ? 'pr.png' : 'lk.png');
    }

    // Jika request dari halaman edit, ambil data divisi untuk dropdown
    const isEdit = req.path.includes('edit');
    let divisiList = [];
    if (isEdit) {
      divisiList = await Anggota.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('divisi')), 'divisi']],
        raw: true,
        where: {
          role: { [Op.ne]: 'admin' }
        },
      });
    }

    let jenis_kelamin = '';
    switch (anggota.gender) {
        case 'pria':
            jenis_kelamin = 'Laki-laki';
            break;
        case 'wanita':
            jenis_kelamin = 'Perempuan';
            break;
        default:
            jenis_kelamin = '';
            break;
    }

    const viewData = {
      title: isEdit ? 'Edit Anggota' : 'Detail Anggota',
      layout: 'layouts/admin.hbs',
      anggota: {
        ...anggota.dataValues,
        foto_profil: fotoProfil,
        status: anggota.status_anggota === 'aktif',
        jenis_kelamin_display: jenis_kelamin,
      },
      akun: req.user
    };

    // Tambah divisiList jika halaman edit
    if (isEdit) {
      viewData.timList = timList;
    }

    res.render(`admin/manajemen_anggota/${isEdit ? 'edit' : 'detail'}_anggota`, viewData);

  } catch (error) {
    next(error);
  }
};

// get anggota untuk ubah password
const getAnggotaToChangePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const anggota = await Anggota.findByPk(id);
    
    if (!anggota) {
      return res.redirect('/admin/manajemen_anggota');
    }

    res.render('admin/manajemen_anggota/ubahpw_anggota', {
      title: 'Ubah Password Anggota',
      layout: 'layouts/admin.hbs',
      anggota,
      akun: req.user
    });

  } catch (error) {
    next(error);
  }
};

// create anggota
const createAnggota = async (req, res, next) => {
  try {
    const {
      nama,
      nip,
      jabatan,
      divisi,
      role,
      email,
      gender,
      password
    } = req.body;

    // Cek NIP sudah ada atau belum
    const existingAnggota = await Anggota.findOne({ where: { nip } });
    if (existingAnggota) {
      return res.status(400).json({
        success: false,
        message: 'NIP sudah terdaftar'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set foto default berdasarkan gender
    let foto = null;
    if (req.file) {
      foto = `/uploads/foto_profile/${req.file.filename}`;
    } else {
      foto = `/default_pp/${gender === 'wanita' ? 'pr.png' : 'lk.png'}`;
    }

    // Create anggota baru
    await Anggota.create({
      nip,
      nama,
      email,
      password: hashedPassword,
      role,
      gender,
      divisi,
      jabatan,
      foto,
      status_anggota: 'aktif'
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error creating anggota:', error);
    next(error);
  }
};

// Hapus anggota
const deleteAnggota = async (req, res, next) => {
  try {
    const { nip } = req.body;
    
    const result = await Anggota.destroy({
      where: { nip }
    });

    if (result === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Anggota tidak ditemukan' 
      });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error deleting anggota:', error);
    next(error);
  }
};

// edit anggota (edit data & ubah password)
const editAnggota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nama,
      nip,
      jabatan,
      divisi,
      role,
      email,
      gender,
      status_anggota,
      password_baru // untuk reset password
    } = req.body;

    const anggota = await Anggota.findByPk(id);
    if (!anggota) {
      return res.status(404).json({
        success: false,
        message: 'Anggota tidak ditemukan'
      });
    }

    // Jika ada password baru (dari reset password)
    if (password_baru) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_baru, salt);
      await anggota.update({ password: hashedPassword });
    } else {
      // Update data anggota
      let foto = anggota.foto;
      if (req.file) {
        // Hapus foto lama jika bukan default
        if (anggota.foto && !anggota.foto.includes('default_pp')) {
          const oldPath = path.join(__dirname, '../public', anggota.foto);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        foto = `/uploads/foto_profile/${req.file.filename}`;
      }

      await anggota.update({
        nama,
        jabatan,
        divisi,
        role,
        email,
        gender,
        foto,
        status_anggota
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error editing anggota:', error);
    next(error);
  }
};

module.exports = {
  getAllAnggota,
  getOneAnggota,
  getAnggotaToChangePassword,
  createAnggota,
  deleteAnggota,
  editAnggota,
}