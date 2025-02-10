const express = require('express');
const router = express.Router();

const { getActivePemilihan,
        getInputPenilaian,
        createDataPenilaian,
        getAllDataPenilaian,
        getAllKandidatEligible,
      } = require('../controllers/HandlePemilihan');
const { startVot1,
        getMonitorVot1, 
        closeVot1, 
        getKandidatPenilaianKriteria,
        setKandidatPenilaianKriteria,
        getMonitorVot2,
        closeVot2,
      } = require('../controllers/HandleVote');

// Route untuk halaman pemilihan berlangsung - GET
router.get('/', getActivePemilihan);

// Router untuk halaman input penilaian - GET
router.get('/:id/input_penilaian', getInputPenilaian);

// Router untuk upload excel penilaian - POST
router.post('/:id/hasil_penilaian', createDataPenilaian);

// Router untuk halaman hasil penilaian - GET
router.get('/:id/hasil_penilaian', getAllDataPenilaian);

// Router untuk halaman hasil kandidat eligible - GET
router.get('/:id/hasil_kandidat', getAllKandidatEligible);

// Route untuk memulai voting 1 - POST
router.post('/:id/start_voting1', startVot1);
  
// Route untuk halaan monitor voting 1 - GET
router.get('/:id/monitor_voting1', getMonitorVot1);

// Route untuk menghandle tutup voting 1 - POST
router.post('/:id/tutup_voting1', closeVot1);

// Route untuk halaman kandidat penilaian keriteria - GET
router.get('/:id/kandidat_penilaian_kriteria', getKandidatPenilaianKriteria);

// Route untuk simpan kandidat penilaian kriteria - POST
router.post('/:id/simpan_kandidat_penilaian_kriteria', setKandidatPenilaianKriteria);

// Route untuk monitor voting 2
router.get('/:id/monitor_voting2', getMonitorVot2);

// Route untuk menghandle tutup voting 2 - POST
router.post('/:id/tutup_voting2', closeVot2);

// Router untuk halaman hasil voting 2
router.get("/:id/hasil_kriteria", function (req, res, next) {
  res.render("admin/pemilihan_berlangsung/hasil_kriteria", { 
    title: "Hasil Kriteria", 
    layout: 'layouts/admin.hbs',
  });
});

router.get("/:id/kandidat_terpilih", function (req, res, next) {
  res.render("admin/pemilihan_berlangsung/kandidat_terpilih", { 
    title: "Kandidat Terpilih",
    layout: 'layouts/admin.hbs',
  });
});

module.exports = router;