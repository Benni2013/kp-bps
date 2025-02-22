# E-Voisy (Electronic Voting Information System)

<p align="center">
  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/befd2e64e54fd7a8ae9ef1614d7a9d870a896659a28381b2db0f62470189d471?apiKey=0eb9abb28bf34cd7be47a2dfb2f311cb&" alt="E-Voisy Logo" width="200"/>
</p>

> Sistem pemilihan pegawai terbaik berbasis web untuk Badan Pusat Statistik Kota Padang

## 📋 Deskripsi

E-Voisy adalah aplikasi web yang dikembangkan untuk memfasilitasi proses pemilihan pegawai terbaik di BPS Kota Padang. Sistem ini menyediakan platform digital yang andal dan efisien untuk melakukan proses voting dan penilaian pegawai.

### 🎯 Fitur Utama
 
- Sistem voting 2 tahap
- Penilaian berbasis kriteria
- Monitoring hasil voting real-time
- Generasi laporan otomatis
- Dashboard admin yang komprehensif

## 🚀 Cara Instalasi

### Prasyarat

- Node.js (versi 20 atau lebih baru)
- MySQL
- Sequelize CLI (`npm install -g sequelize-cli`)

### Langkah Instalasi

1. Clone repositori
```bash
git clone https://github.com/username/kp-bps.git
cd kp-bps
```

2. Install dependensi
```bash
npm install
```

3. Konfigurasi database
- Buat file `.env` di root folder jika tidak ada
```env
PORT= 'your_port'

NODE_ENV = 'development' # atau 'production' / 'test'
DEBUG = True
SECRET_KEY = 'your_secret_key'
```
- Buka file `config/config.json` dan ubah konfigurasi database sesuai kebutuhan

4. Persiapan data awal
```bash

# Jalankan migrasi database
npx sequelize-cli db:migrate

# Jalankan seeder
npx sequelize-cli db:seed:all

# atau jalankan seeder dengan prompt berikut jika tidak memasukkan data ke db config development
npx cross-env NODE_ENV=[your_config] sequelize-cli db:seed:all

# contoh:
npx cross-env NODE_ENV=test sequelize-cli db:seed:all
```

5. Jalankan aplikasi
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000` atau di port yang telah dikonfigurasi di file `.env`.

## 📚 Struktur Database

```
├── migrations/          # File migrasi database
├── models/             # Model Sequelize
├── seeders/            # Data awal
└── config/            # Konfigurasi database
```

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Frontend**: Handlebars, TailwindCSS
- **File Handling**: ExcelJS, xlsx, PDFkit, fs, path, etc

## 👥 Role Pengguna

1. **Admin**
   - Manajemen anggota
   - Manajemen kriteria
   - Manajemen pemilihan
   - Monitor voting
   - Generasi laporan

2. **Pegawai**
   - Melakukan voting
   - Melihat hasil
   - Melihat laporan progress pemilihan di dashboard (khusus untuk supervisor)

## 📝 Alur Pemilihan

1. Input data nilai CKP dan absensi
2. Voting tahap 1 (pemilihan 3 kandidat)
3. Voting tahap 2 (penilaian berdasarkan kriteria)
4. Pengumuman hasil

## 👥 Tim Developer
- [Annisa Nurul Hakim](https://instagram.com/thisis.annisa/)
- [Frizqya Dela Pratiwi](https://instagram.com/frizqyadela)
- [Benni Putra Chaniago](https://instagram.com/benni_chaniago28/)
- [Muhammad Raihan Alghifari](https://instagram.com/mralghifr_)
- [Faiz Hadyan](https://instagram.com/feyyy_fz)

## 📞 Kontak

Untuk informasi lebih lanjut, silakan hubungi:
- Email: bps1371@bps.go.id
- Telp. (0751) 498515
- Website: https://padangkota.bps.go.id
- Alamat: Jl. By Pass KM. 13 Kel. Sungai Sapih Kec. Kuranji Padang 25159

---
