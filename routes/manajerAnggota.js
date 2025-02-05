const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { getAllAnggota, getOneAnggota, getAnggotaToChangePassword, createAnggota, deleteAnggota, editAnggota } = require('../controllers/ManajerAnggota');

// Buat fungsi untuk cek dan buat direktori
const createUploadDir = () => {
  const uploadDir = './public/uploads/foto_profile';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

// Konfigurasi multer untuk upload foto
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Pastikan direktori ada sebelum upload
    createUploadDir();
    cb(null, './public/uploads/foto_profile');
  },
  filename: function(req, file, cb) {
    // Format tanggal: YYYYMMDD_HHmm
    const today = new Date();
    const date = today.getFullYear().toString() +
                (today.getMonth() + 1).toString().padStart(2, '0') +
                today.getDate().toString().padStart(2, '0') + '_' + 
                today.getHours().toString().padStart(2, '0') + 
                today.getMinutes().toString().padStart(2, '0');
    
    // Format nama file: nip_YYYYMMDD.extension
    const filename = `${req.body.nip}_${date}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// Filter file yang diupload
const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Hanya file gambar (JPG, JPEG, PNG) yang diperbolehkan'));
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
});

// Router untuk halaman manajemen anggota - GET
router.get('/', getAllAnggota);

// Router untuk halaman tambah anggota - GET
router.get('/tambah_anggota', function(req, res, next) {
  res.render('admin/manajemen_anggota/tambah_anggota', { 
    title: 'Tambah Anggota',
    layout: 'layouts/admin.hbs', 
  });
});

// Router untuk proses tambah anggota - POST
router.post('/tambah_anggota', upload.single('foto_profile'), createAnggota);

// Router untuk halaman detail anggota - GET
router.get('/detail_anggota/:id', getOneAnggota);

// Router untuk halaman edit anggota - GET
router.get('/edit_anggota/:id', getOneAnggota);

// Router untuk proses edit anggota - POST
router.post('/edit_anggota/:id', upload.single('foto_profile'), editAnggota);


// Router untuk halaman ubah password anggota - GET
router.get('/ubahpw_anggota/:id', getAnggotaToChangePassword);

// Router untuk proses ubah password anggota - POST
router.post('/ubahpw_anggota/:id', editAnggota);

// Router untuk proses hapus anggota - POST
router.post('/hapus_anggota', deleteAnggota);


module.exports = router;