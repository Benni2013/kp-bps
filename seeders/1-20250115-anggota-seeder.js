'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const anggotaData = [
      {
        nip: '101010',
        nama: 'Admin',
        email: 'admin_evoisy@example.com',
        password: await bcrypt.hash('admin', 10),
        role: 'admin',
        jabatan: 'Admin WEB E-Voisy',
        divisi: 'Admin WEB',
        status_anggota: 'aktif',
        status_karyawan: 'aktif',
      },
      {
        nip: "050061116",
        nama: "Yusuf, SH.",
        email: "yusuf3@bps.go.id",
        password: await bcrypt.hash('050061116', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Reformasi Birokrasi, Zona Integritas dan Indikator Strategis",
        jabatan: "Fungsional Umum",
        foto: "/uploads/foto_profile/050061116.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340011713",
        nama: "Mega Wulansari, SE",
        email: "megaws@bps.go.id",
        password: await bcrypt.hash('340011713', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Kasubag Umum",
        jabatan: "Kepala Subbagian Umum",
        foto: "/uploads/foto_profile/340011713.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340013515",
        nama: "Ahmad Nur, SE.",
        email: "ahmadnur@bps.go.id",
        password: await bcrypt.hash('340013515', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Pariwisata dan profiling Statistical Business Register (SBR)",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340013515.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340014375",
        nama: "Yatria Nova",
        email: "yatrianova@bps.go.id",
        password: await bcrypt.hash('340014375', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Diseminasi dan Teknologi Informasi",
        jabatan: "Fungsional Umum",
        foto: "/uploads/foto_profile/340014375.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340015616",
        nama: "Edy, SE",
        email: "edy3@bps.go.id",
        password: await bcrypt.hash('340015616', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Statistik Pertanian",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340015616.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340015808",
        nama: "Alfianto, S.Kom, M.Kom",
        email: "alfianto@bps.go.id",
        password: await bcrypt.hash('340015808', 10),
        role: "supervisor",
        gender: "pria",
        divisi: "Kepala BPS Kota Padang",
        jabatan: "Kepala BPS Kabupaten/Kota",
        foto: "/uploads/foto_profile/340015808.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340015809",
        nama: "Raflis, S.Kom",
        email: "raflis@bps.go.id",
        password: await bcrypt.hash('340015809', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Sub Tim EPSS",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340015809.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340017452",
        nama: "Eka Nurul Fitri, S.Kom, M.CIO.",
        email: "ekanurul@bps.go.id",
        password: await bcrypt.hash('340017452', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Distribusi",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340017452.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340017455",
        nama: "Yossi Windria, SE, ME",
        email: "yossiwindria@bps.go.id",
        password: await bcrypt.hash('340017455', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Distribusi",
        jabatan: "Statistisi Ahli Pertama",
        foto: "/uploads/foto_profile/340017455.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340017906",
        nama: "Chairil Fadli, SST",
        email: "chairil@bps.go.id",
        password: await bcrypt.hash('340017906', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Pembinaan Statistik Sektoral",
        jabatan: "Statistisi Ahli Madya",
        foto: "/uploads/foto_profile/340017906.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340020515",
        nama: "Iswady Idris, S.M.",
        email: "iswady.idris@bps.go.id",
        password: await bcrypt.hash('340020515', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Statistik Kesejahteraan Rakyat dan Ketahanan Sosial",
        jabatan: "Fungsional Umum",
        foto: "/uploads/foto_profile/340020515.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340050226",
        nama: "Riska Febrina, SST, M.E.K.K",
        email: "rfebrina@bps.go.id",
        password: await bcrypt.hash('340050226', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Harga",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340050226.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340054580",
        nama: "Alfid Junaidy, S.E.",
        email: "alfid@bps.go.id",
        password: await bcrypt.hash('340054580', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Sub Tim Humas, PPID dan Manajemen Mitra",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340054580.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340054582",
        nama: "Bilal Alsyiddiq, S.Si, M.Pd",
        email: "syiddiq.bilal@bps.go.id",
        password: await bcrypt.hash('340054582', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Subbagian Umum",
        jabatan: "Analis Pengelolaan Keuangan APBN Ahli Muda",
        foto: "/uploads/foto_profile/340054582.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340054588",
        nama: "Elfi Khaira, SE., M.Si",
        email: "elfi@bps.go.id",
        password: await bcrypt.hash('340054588', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Sub Tim SAKIP",
        jabatan: "Statistisi Ahli Muda",
        foto: "https://hhqgxqjtvlgbtlpvggdg.supabase.co/storage/v1/object/sign/avatar_1371/340054588.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJfMTM3MS8zNDAwNTQ1ODguanBnIiwiaWF0IjoxNzMxMzgwMzA4LCJleHAiOjIwNDY3NDAzMDh9.s3v49Ca3rXUObdT26OU_VQgvR9jwi7KqR_8mOxaVPis&t=2024-11-12T02%3A58%3A28.383Z",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340054590",
        nama: "Firlan, S.Si, M.Si",
        email: "firlan@bps.go.id",
        password: await bcrypt.hash('340054590', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Pengolahan",
        jabatan: "Pranata Komputer Ahli Muda",
        foto: "/uploads/foto_profile/340054590.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340054592",
        nama: "Gesti Sapardi, A.Md",
        email: "gesti@bps.go.id",
        password: await bcrypt.hash('340054592', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Pengolahan",
        jabatan: "Statistisi Mahir",
        foto: "/uploads/foto_profile/340054592.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340054621",
        nama: "Yori Akmal, S.P.",
        email: "yori@bps.go.id",
        password: await bcrypt.hash('340054621', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Statistik Kesejahteraan Rakyat dan Ketahanan Sosial",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340054621.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340055919",
        nama: "Sherly Aktivani, SST, M.Sc.",
        email: "sherlyaktivani@bps.go.id",
        password: await bcrypt.hash('340055919', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Industri dan Pertambangan Energi dan kontruksi",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340055919.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340055984",
        nama: "Fikri Abdullah, A.Md",
        email: "fikri.abdullah@bps.go.id",
        password: await bcrypt.hash('340055984', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Statistik Harga",
        jabatan: "Statistisi Mahir",
        foto: "/uploads/foto_profile/340055984.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340056019",
        nama: "Rhades Fikar, A.Md",
        email: "rhades.fikar@bps.go.id",
        password: await bcrypt.hash('340056019', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Pembinaan Statistik Sektoral",
        jabatan: "Statistisi Terampil",
        foto: "/uploads/foto_profile/340056019.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340056366",
        nama: "Moh. Roufiq Azmy, SST, M.T.",
        email: "roufiq@bps.go.id",
        password: await bcrypt.hash('340056366', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Diseminasi dan Teknologi Informasi",
        jabatan: "Pranata Komputer Ahli Muda",
        foto: "https://hhqgxqjtvlgbtlpvggdg.supabase.co/storage/v1/object/sign/avatar_1371/340056366.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJfMTM3MS8zNDAwNTYzNjYuanBnIiwiaWF0IjoxNzMxMzgwNzgwLCJleHAiOjIwNDY3NDA3ODB9.bV-52X5TWQWSWqyP8lucx3FZN-6QZFN7GAsh-3K-Xzg&t=2024-11-12T03%3A06%3A20.114Z",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340056794",
        nama: "Armalia Desiyanti, SST., M.Stat.",
        email: "adesiyanti@bps.go.id",
        password: await bcrypt.hash('340056794', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Neraca Pengeluaran dan Analisis",
        jabatan: "Statistisi Ahli Muda",
        foto: "https://hhqgxqjtvlgbtlpvggdg.supabase.co/storage/v1/object/sign/avatar_1371/340056794.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJfMTM3MS8zNDAwNTY3OTQuanBnIiwiaWF0IjoxNzMxMzgwNzkwLCJleHAiOjIwNDY3NDA3OTB9.KX3V0AhWsrrTrCtAEynPz7LjOqLU5W8h6sDvxzAwdGQ&t=2024-11-12T03%3A06%3A30.360Z",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340056908",
        nama: "Winda Dwi Putri, SST",
        email: "winda.dp@bps.go.id",
        password: await bcrypt.hash('340056908', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Neraca Produksi",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340056908.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340056940",
        nama: "Deva Sabrina, SST., M.M.",
        email: "devas@bps.go.id",
        password: await bcrypt.hash('340056940', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Neraca Produksi",
        jabatan: "Fungsional Umum",
        foto: "https://hhqgxqjtvlgbtlpvggdg.supabase.co/storage/v1/object/sign/avatar_1371/340056940.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJfMTM3MS8zNDAwNTY5NDAuanBnIiwiaWF0IjoxNzMxMzgwODEzLCJleHAiOjIwNDY3NDA4MTN9.N_kimsNuQmRA_18tfu2iyGnU9O6CPsTJIk5oABDCrRA&t=2024-11-12T03%3A06%3A53.114Z",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340057112",
        nama: "Kurnia Prima Ramadhana, SST",
        email: "kurnia.ramadhana@bps.go.id",
        password: await bcrypt.hash('340057112', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Ketenagakerjaan",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340057112.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340057226",
        nama: "Vantri Eka Syuryani, SST",
        email: "vantrieka@bps.go.id",
        password: await bcrypt.hash('340057226', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Ketenagakerjaan",
        jabatan: "Statistisi Ahli Muda",
        foto: "/uploads/foto_profile/340057226.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340058555",
        nama: "Adenil Zakaria, S.Tr.Stat.",
        email: "adennear@bps.go.id",
        password: await bcrypt.hash('340058555', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Statistik Neraca Pengeluaran dan Analisis",
        jabatan: "Statistisi Ahli Pertama",
        foto: "/uploads/foto_profile/340058555.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340059135",
        nama: "Silvia Netsyah, S.Si.",
        email: "silvia.netsyah@bps.go.id",
        password: await bcrypt.hash('340059135', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Pariwisata dan profiling Statistical Business Register (SBR)",
        jabatan: "Statistisi Ahli Pertama",
        foto: "https://hhqgxqjtvlgbtlpvggdg.supabase.co/storage/v1/object/sign/avatar_1371/340059135.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJfMTM3MS8zNDAwNTkxMzUuanBnIiwiaWF0IjoxNzMxMzgwODgyLCJleHAiOjIwNDY3NDA4ODJ9.i1WFyNIGJJc6LHvf_rXRAljZ6UXsCr1PJVsLs93Hu-g&t=2024-11-12T03%3A08%3A02.010Z",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340061052",
        nama: "Adolf Jaya Sebastian Lubis, A.Md.Kb.N.",
        email: "adolf.lubis@bps.go.id",
        password: await bcrypt.hash('340061052', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Subbagian Umum",
        jabatan: "Pranata Keuangan APBN Terampil",
        foto: "/uploads/foto_profile/340061052.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340061204",
        nama: "Aulia Rahman Harahap, A.Md",
        email: "aulia.harahap@bps.go.id",
        password: await bcrypt.hash('340061204', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Statistik Pertanian",
        jabatan: "Statistisi Terampil",
        foto: "https://hhqgxqjtvlgbtlpvggdg.supabase.co/storage/v1/object/sign/avatar_1371/340061204.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJfMTM3MS8zNDAwNjEyMDQuanBnIiwiaWF0IjoxNzMxMzgwOTAyLCJleHAiOjIwNDY3NDA5MDJ9.bO9FTnNtrj__7ExuJq_VGKCEjxwWCE9Ad0GGjMMnspE&t=2024-11-12T03%3A08%3A21.658Z",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340061495",
        nama: "Rahmila Zola, A.Md.",
        email: "rahmila.zola@bps.go.id",
        password: await bcrypt.hash('340061495', 10),
        role: "biasa",
        gender: "wanita",
        divisi: "Statistik Industri dan Pertambangan Energi dan kontruksi",
        jabatan: "Statistisi Terampil",
        foto: "/uploads/foto_profile/340061495.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340062282",
        nama: "Kuci Purnomo, A.Md.",
        email: "kucipurnomo-pppk@bps.go.id",
        password: await bcrypt.hash('340062282', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Subbagian Umum",
        jabatan: "Pustakawan Terampil",
        foto: "/uploads/foto_profile/340062282.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      {
        nip: "340062774",
        nama: "Afriyoni, A.Md.",
        email: "afriyoni-pppk@bps.go.id",
        password: await bcrypt.hash('340062774', 10),
        role: "biasa",
        gender: "pria",
        divisi: "Subbagian Umum",
        jabatan: "Pranata SDM Aparatur Terampil",
        foto: "/uploads/foto_profile/340062774.JPG",
        status_anggota: "aktif",
        status_karyawan: "aktif"
      },
      
    ];

    await queryInterface.bulkInsert('anggota', anggotaData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('anggota', null, {});
  }
};