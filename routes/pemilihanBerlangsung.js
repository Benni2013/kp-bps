const express = require('express');
const router = express.Router();

const { getActivePemilihan,
        getInputPenilaian,
      } = require('../controllers/HandlePemilihan');

// Route untuk halaman pemilihan berlangsung - GET
router.get('/', getActivePemilihan);

// Router untuk halaman input penilaian - GET
router.get('/:id/input_penilaian', getInputPenilaian);

// Router untuk upload excel penilaian - POST
router.post('/:id/hasil_penilaian', function (req, res, next) {
  console.log('\nFile Excel Penilaian Terunggah\n')
  const id = req.params.id;

  res.redirect(`/admin/pemilihan_berlangsung/${id}/hasil_penilaian`)
  
});

// Router untuk halaman hasil penilaian - GET
router.get('/:id/hasil_penilaian', function(req, res, next) {
  res.render('admin/pemilihan_berlangsung/hasil_penilaian', { 
   title: 'Hasil Penilaian',
   layout: 'layouts/admin.hbs',
  });
});

// Router untuk halaman hasil kandidat eligible - GET
router.get('/:id/hasil_kandidat', function (req, res, next) {
  res.render('admin/pemilihan_berlangsung/hasil_kandidat', { 
    title: 'Hasil Kandidat', 
    layout: 'layouts/admin.hbs',
  });
});

// data dummy untuk monitor voting 1
const voting1Status = {
  isVotingOpen: true,
  totalPemilih: 34,
  sudahVote: 20,
  belumVote: 4,
  progressPercentage: 80,
};
  
// Route untuk halaan monitor voting 1 - GET
router.get('/:id/monitor_voting1', function(req, res, next) {
  // votingStatus.isVotingOpen = true;

  const anggota = [
      { no: 1, nama: "Frizqya Dela Pratiwi", sudahVote: true, waktu: "2024-01-15 09:30",
      },
      { no: 2, nama: "Annisa Nurul Hakim", sudahVote: true, waktu: "2024-01-15 10:45",
      },
      { no: 3, nama: "Muhammad Raihan Alghifari", sudahVote: false, waktu: "-",
      },
  ];
  const hasilVoting = [
    { nama: "Frizqya Dela Pratiwi", votes: 20, percentage: 60,
    },
    { nama: "Annisa Nurul Hakim", votes: 8, percentage: 24,
    },
    { nama: "Muhammad Raihan Alghifari", votes: 5, percentage: 16,
    },
  ];

  res.render('admin/pemilihan_berlangsung/monitor_voting1', { 
    title: 'Monitor Voting 1',
    layout: 'layouts/admin.hbs',
    anggota: anggota,
    votingStatus: voting1Status,
    hasilVoting: hasilVoting,
   });
});

// Route untuk menghandle tutup voting 1 - POST
router.post('/:id/tutup_voting1', (req, res) => {
  voting1Status.isVotingOpen = false;

  console.log('\nVoting 1 berhasil ditutup\n');

  res.json({ success: true, message: 'Voting berhasil ditutup', });
});

// Route untuk halaman kandidat penilaian keriteria - GET
router.get('/:id/kandidat_penilaian_kriteria', function(req, res, next) {
  // Data dummy untuk kandidat
  const kandidatData = [
    { no: 1, nama: "Frizqya Dela Pratiwi", skor1: 45, skor2: 45, skor3: 45, total: 100, },
    { no: 2, nama: "Annisa Nurul Hakim", skor1: 15, skor2: 15, skor3: 15, total: 99, },
    { no: 3, nama: "Muhammad Raihan Alghifari", skor1: 15, skor2: 15, skor3: 15, total: 99, },
    { no: 4, nama: "Benni Putra Chaniago", skor1: 3, skor2: 3, skor3: 3, total: 98, },
    { no: 5, nama: "Faiz Hadyan", skor1: 3, skor2: 3, skor3: 3, total: 98, },
  ];

  res.render('admin/pemilihan_berlangsung/kandidat_penilaian_kriteria', { 
    title: 'Kandidat Penilaian Kriteria',
    layout: 'layouts/admin.hbs',
    kandidat: kandidatData,
   });
});

// Route untuk simpan kandidat penilaian kriteria - POST
router.post('/:id/simpan_kandidat_penilaian_kriteria', (req, res) => {

  console.log('\nData kandidat penilaian kriteria berhasil disimpan\n');

  res.redirect('/admin/pemilihan_berlangsung/monitor_voting2');
});

// data untuk monitor voting 2
const voting2Status = {
  isVotingOpen: true,
  totalPengisi: 34,
  sudahIsi: 20,
  belumIsi: 4,
  progressPercentage: 80,
};

// Route untuk monitor voting 2
router.get('/:id/monitor_voting2', function(req, res, next) {
  // voting2Status.isVotingOpen = true;

  // Data dummy untuk anggota
  const anggota = [
      { no: 1, nama: "Frizqya Dela Pratiwi", sudahMengisi: true, waktu: "2024-01-15 09:30", },
      { no: 2, nama: "Annisa Nurul Hakim", sudahMengisi: true, waktu: "2024-01-15 10:45", },
      { no: 3, nama: "Muhammad Raihan Alghifari", sudahMengisi: false, waktu: "-", },
  ];

  res.render('admin/pemilihan_berlangsung/monitor_voting2', { 
    title: 'Monitor Voting 2',
    layout: 'layouts/admin.hbs',
    anggota: anggota,
    votingStatus: voting2Status,
   });
});

// Route untuk menghandle tutup voting 2 - POST
router.post('/:id/tutup_voting2', (req, res) => {
  voting2Status.isVotingOpen = false;

  console.log('\nPenilaian Kriteria berhasil ditutup\n');

  res.json({ success: true, message: 'Penilaian Kriteria berhasil ditutup', });
});

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

// // Router untuk halaman hasil voting 2 - GET
// router.get('/hasil_voting2', (req, res) => {
//   res.render('admin/hasil_voting2', {
//       title: 'Hasil Voting 2',
//       layout: 'layouts/admin.hbs',
//   });
// });

// // Route untuk halaman pegawai terbaik - GET
// router.get('/pegawai_terbaik', (req, res) => {
//   res.render('admin/pegawai_terbaik', {
//       title: 'Pegawai Terbaik',
//       layout: 'layouts/admin.hbs',
//   });
// });

module.exports = router;