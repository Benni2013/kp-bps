// ManajerKriteria

// - getAllKriteria  (done)
// - createKriteria  (done)
// - getOneKriteria (utk di halaman detail data dan di halaman edit)  (done)
// - editKriteria    (done)
// - deleteKriteria  (done)

const { Indikator, Sequelize } = require('../models');
const { Op } = Sequelize;

const kategoriList = [
  "Adaptif",
  "Akuntabel",
  "Berorientasi Pelayanan",
  "Harmonis",
  "Kolaboratif",
  "Kompeten",
  "Loyal",
];

// Get all kriteria
const getAllKriteria = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const selectedCategories = req.query.categories ? req.query.categories.split(',') : [];
    
    let whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { isi_indikator: { [Op.like]: `%${search}%` } },
        { tipe_indikator: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (selectedCategories.length > 0) {
      whereClause.tipe_indikator = { [Op.in]: selectedCategories };
    }

    const { count, rows: dataKriteria } = await Indikator.findAndCountAll({
      where: whereClause,
      order: [['tipe_indikator', 'ASC'],
              ['isi_indikator', 'ASC']
              ]
    });

    // Get categories with count
    const categoriesWithCount = await Indikator.findAll({
      attributes: [
        'tipe_indikator',
        [Sequelize.fn('COUNT', Sequelize.col('indikator_id')), 'count']
      ],
      group: ['tipe_indikator'],
      raw: true
    });

    return res.render('admin/manajemen_kriteria/manajemen_kriteria', {
      title: 'Manajemen Kriteria',
      layout: 'layouts/admin.hbs',
      dataKriteria: dataKriteria.map(k => ({
        id: k.indikator_id,
        isi_kriteria: k.isi_indikator,
        kategori: k.tipe_indikator,
        status: k.status_inditakor === 'aktif'
      })),
      categories: categoriesWithCount,
      search,
      totalData: count,
      selectedCategories,
      akun: req.user
    });

  } catch (error) {
    next(error);
  }
};

// Create kriteria
const createKriteria = async (req, res, next) => {
  try {
    const { isi_kriteria, tipe_indikator } = req.body;

    // Buat kriteria baru
    await Indikator.create({
      isi_indikator: isi_kriteria,
      tipe_indikator: tipe_indikator,
      status_inditakor: 'aktif' // default aktif
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating kriteria:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get one kriteria
const getOneKriteria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kriteria = await Indikator.findByPk(id);
    
    if (!kriteria) {
      return res.redirect('/admin/manajemen_kriteria');
    }

    res.render('admin/manajemen_kriteria/edit_kriteria', {
      title: 'Edit Kriteria',
      layout: 'layouts/admin.hbs',
      kriteria,
      kategoriList,
      akun: req.user
    });
  } catch (error) {
    next(error);
  }
};

// Edit kriteria
const editKriteria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isi_indikator, tipe_indikator, status_inditakor } = req.body;

    const result = await Indikator.update({
      isi_indikator,
      tipe_indikator,
      status_inditakor
    }, {
      where: { indikator_id: id }
    });

    // Periksa apakah update berhasil
    if (result[0] === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kriteria tidak ditemukan' 
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating kriteria:', error);
    next(error);
  }
};

// Hapus kriteria
const deleteKriteria = async (req, res, next) => {
  try {
    const { id } = req.body;
    
    const result = await Indikator.destroy({
      where: { indikator_id: id }
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kriteria tidak ditemukan'
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting kriteria:', error);
    next(error);
  }
};

module.exports = {
  getAllKriteria,
  getOneKriteria,
  editKriteria,
  createKriteria,
  deleteKriteria,
};