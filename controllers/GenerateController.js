// GenerateController

// - ucapan terimakasih
// - template penilaian               (done)
// - laporan data nilai               (done)
// - laporan voting 1                 (done)
// - laporan penilaian kriteria (hasil akhir pemilihan)   (done)
// - rekap laporan pemilihan          (done)

const jwt = require("jsonwebtoken");
const { Anggota, 
        Pemilihan, 
        Periode,
        DetailPemilihan, 
        DataNilai, 
        Voting1, 
        Voting2, 
        Indikator } = require("../models");
const PDFDocument = require("pdfkit");
const XLSX = require('xlsx');
const path = require("path");
const fs = require("fs");

const terimakasih = async (req, res, next) => {
  try {
    let pemilihan = await Pemilihan.findOne({
      where: {
        tahap_pemilihan: "voting2",
      },
    });
    const akun = req.user;

    let detail_pemilihan = await DetailPemilihan.findOne({
      where: {
        pemilihan_id: pemilihan.pemilihan_id,
        anggota_id: akun.nip,
      },
    });

    let voting2 = await Voting2.findOne({
      where: {
        detail_pemilihan_id: detail_pemilihan.detail_pemilihan_id,
      },
    });

    // Data untuk PDF
    const namaAnggota = akun.nama; // Ganti dengan data dinamis, contoh: req.body.nama
    const selesaiVoting = voting2.waktu_vot2; // Waktu selesai voting
    const generateTanggal = new Date(); // Waktu generate file PDF

    // Konfigurasi nama file
    const fileName = `bukti-voting-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../public/files", fileName);

    // Buat dokumen PDF
    const doc = new PDFDocument();

    // Simpan ke file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Tambahkan konten ke PDF
    doc.fontSize(16).text("E-Voisy", { align: "center" });
    doc.fontSize(14).text("BADAN PUSAT STATISTIK KOTA PADANG", { align: "center", underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Nama Anggota: ${namaAnggota}`);
    doc.text("Dengan ini kami sampaikan ucapan terima kasih atas partisipasi Anda dalam pemilihan pegawai terbaik.");
    doc.text("Surat ini merupakan bukti bahwa Anda telah selesai melakukan voting.");
    doc.moveDown();

    doc.text(`Waktu Voting: ${selesaiVoting.toLocaleDateString()} pukul ${selesaiVoting.toLocaleTimeString()} WIB`);
    doc.moveDown();

    doc.text("Surat ini dilampirkan sebagai bukti sah telah dilaksanakannya proses voting pada SISTEM E-Voisy BPS Kota Padang.");
    doc.moveDown();

    doc.text(`Padang, ${generateTanggal.toLocaleDateString()}`);
    doc.text("Sistem E-Voisy BPS Kota Padang");
    doc.moveDown();

    doc.text(`Dokumen ini digenerate secara otomatis dan sah tanpa tanda tangan.`);
    doc.text(`Generate pada: ${generateTanggal.toLocaleDateString()} ${generateTanggal.toLocaleTimeString()} WIB`);

    // Akhiri dan simpan PDF
    doc.end();

    // Tunggu hingga file selesai ditulis
    writeStream.on("finish", () => {
      // Berikan file untuk diunduh
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Error saat mengunduh file:", err);
          res.redirect("users/beranda");
        } else {
          // Hapus file setelah diunduh
          fs.unlinkSync(filePath);
        }
      });
    });
  } catch (error) {
    console.error("Generate terimakasih error:", error);
    res.redirect("users/beranda");
  }
};

// fungsi untuk mendapatkan data bulan berdasarkan periode
function getBulanPeriode(namaPeriode) {
  switch (namaPeriode) {
    case 'Tahunan':
      return ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
              'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    case 'Semester 1':
      return ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
    case 'Semester 2':
      return ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    case 'Triwulan 1':
      return ['Januari', 'Februari', 'Maret'];
    case 'Triwulan 2':
      return ['April', 'Mei', 'Juni'];
    case 'Triwulan 3':
      return ['Juli', 'Agustus', 'September'];
    case 'Triwulan 4':
      return ['Oktober', 'November', 'Desember'];
    default:
      return [];
  }
}

// fungsi untuk generate template excel
function templateExcel(pemilihan) {
  const workbook = XLSX.utils.book_new();
  
  // Tentukan bulan berdasarkan periode
  const bulan = getBulanPeriode(pemilihan.Periode.nama_periode);
  
  // Buat header tabel dinamis berdasarkan jumlah bulan
  const mainHeaders = ['No.', 'NIP', 'Nama', 'Jabatan'];
  const subHeaders = ['', '', '', ''];
  const columnCount = mainHeaders.length;
  
  // Buat header bulan dan sub-header untuk tiap bulan
  bulan.forEach((b, bulanIndex) => {
    // Tambah sub-header untuk tiap bulan
    const subHeadersForMonth = [
      'CKP', 'S', 'I', 'TK', 'CB', 'CM', 'CP', 'CT',
      'TL1', 'TL2', 'TL3', 'TL4', 'PSW1', 'PSW2', 'PSW3', 'PSW4'
    ];
    
    // Tambah header bulan (merged cells)
    for(let i = 0; i < 16; i++) {
      mainHeaders.push(b);
    }
    
    // Tambah sub-headers
    subHeaders.push(...subHeadersForMonth);
  });

  // Gabung data anggota
  const rows = [];
  rows.push(mainHeaders);
  rows.push(subHeaders);

  // Isi data anggota
  if (pemilihan.DetailPemilihans && pemilihan.DetailPemilihans.length > 0) {
    pemilihan.DetailPemilihans.forEach((detail, index) => {
      if (detail.Anggotum) {
        const row = [
          index + 1,
          detail.Anggotum.nip,
          detail.Anggotum.nama,
          detail.Anggotum.jabatan || ''
        ];

        // Tambah cell kosong untuk setiap kolom nilai
        const totalColumns = bulan.length * 16;
        for(let i = 0; i < totalColumns; i++) {
          row.push('');
        }

        rows.push(row);
      }
    });
  }

  // Buat worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Styling untuk merged cells header bulan
  const merge = [];
  let colIndex = columnCount;
  bulan.forEach(() => {
    merge.push({
      s: {r: 0, c: colIndex},
      e: {r: 0, c: colIndex + 15}
    });
    colIndex += 16;
  });

  if(!ws['!merges']) ws['!merges'] = [];
  ws['!merges'] = merge;

  // Set column widths
  const colWidths = [];
  colWidths[0] = { wch: 5 };  // No.
  colWidths[1] = { wch: 12 }; // NIP
  colWidths[2] = { wch: 20 }; // Nama
  colWidths[3] = { wch: 30 }; // Jabatan

  // Set width untuk kolom nilai (4 karakter)
  for (let i = 4; i < mainHeaders.length; i++) {
    colWidths[i] = { wch: 5 };
  }
  ws['!cols'] = colWidths;

  // Tambah worksheet ke workbook
  XLSX.utils.book_append_sheet(workbook, ws, 'Template');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// Controller untuk download template penilaian
const downloadTemplatePenilaian = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [
        { 
          model: DetailPemilihan,
          include: [{ 
            model: Anggota,
            attributes: ['nip', 'nama', 'jabatan']
          }]
        },
        { model: Periode }
      ]
    });

    if (!pemilihan) {
      return res.status(404).send('Pemilihan tidak ditemukan');
    }

    // Debug log
    // console.log('\n Detail Pemilihan:', JSON.stringify(pemilihan, null, 2));

    // Generate workbook
    const workbook = templateExcel(pemilihan);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=penilaian_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`);
    
    res.send(workbook);
  } catch (error) {
    console.error('Error generating template: ', error);
    next(error);
  }
};

// Tambahkan fungsi generateLaporanDataNilai
const generateLaporanDataNilai = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data dengan periode
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{ 
        model: Periode 
      }]
    });

    if (!pemilihan) {
      return res.status(404).send('Pemilihan tidak ditemukan');
    }

    // Get data nilai
    const dataNilai = await DetailPemilihan.findAll({
      where: { pemilihan_id: id },
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
      ]
    });

    // Buat workbook baru
    const workbook = XLSX.utils.book_new();
    
    // Buat headers
    const headers = [
      'No', 'NIP', 'Nama', 'Jabatan', 
      'Score CKP', 'Score Absen', 'Skor Akhir', 'Status'
    ];

    // Buat second headers dengan nomor kolom
    const secondHeaders = headers.map((_, index) => `(${index + 1})`);

    // Siapkan data untuk worksheet
    const rows = [headers, secondHeaders];

    // Tambahkan data
    dataNilai.forEach((data, index) => {
      const row = [
        index + 1,
        data.Anggotum.nip,
        data.Anggotum.nama,
        data.Anggotum.jabatan || '',
        data.DataNilai.score_ckp,
        data.DataNilai.score_absen,
        data.DataNilai.score_akhir,
        data.DataNilai.status_anggota === 'eligible' ? 'Eligible' : 'Non-Eligible'
      ];
      rows.push(row);
    });

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Set column widths
    const colWidths = [
      { wch: 5 },  // NO
      { wch: 12 }, // NIP
      { wch: 20 }, // NAMA
      { wch: 30 }, // JABATAN
      { wch: 12 }, // NILAI CKP
      { wch: 15 }, // NILAI ABSENSI
      { wch: 12 }, // TOTAL SKOR
      { wch: 15 }  // STATUS
    ];
    ws['!cols'] = colWidths;

    // Style untuk seluruh cell
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < headers.length; j++) {
        const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
        if (!ws[cellRef]) ws[cellRef] = {};
        if (!ws[cellRef].s) ws[cellRef].s = {};
        
        // Basic style untuk semua cell
        ws[cellRef].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };

        // Bold untuk header
        if (i === 0) {
          ws[cellRef].s.font = { bold: true };
        }
      }
    }

    // Tambah worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, ws, 'Data Nilai');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=laporan_data_nilai_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error generating laporan data nilai:', error);
    next(error);
  }
};

// Laporan voting 1
const generateLaporanVoting1 = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data dengan periode
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{ model: Periode }]
    });

    if (!pemilihan) {
      return res.status(404).send('Pemilihan tidak ditemukan');
    }

    // Get data voting 1 untuk anggota yang eligible
    const dataVoting = await DetailPemilihan.findAll({
      where: { 
        pemilihan_id: id,
        '$DataNilai.status_anggota$': 'eligible' 
      },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama', /* 'jabatan' */]
        },
        {
          model: DataNilai,
          required: true,
          where: { status_anggota: 'eligible' }
        },
        {
          model: Voting1,
          required: false,
          // include: [
          //   { model: Anggota, as: 'Pilihan1', attributes: ['nama'] },
          //   { model: Anggota, as: 'Pilihan2', attributes: ['nama'] },
          //   { model: Anggota, as: 'Pilihan3', attributes: ['nama'] }
          // ]
        }
      ],
      order: [['Voting1', 'total_skor', 'DESC']]
    });

    // Buat workbook baru
    const workbook = XLSX.utils.book_new();
    
    // Buat headers
    const headers = [
      'No', 'NIP', 'Nama', /* 'JABATAN',
      'PILIHAN 1', 'PILIHAN 2', 'PILIHAN 3', */
      'Skor Pilihan 1', 'Skor Pilihan 2', 'Skor Pilihan 3',
      'Total Skor', // 'STATUS'
    ];

    // Buat second headers dengan nomor kolom
    const secondHeaders = headers.map((_, index) => `(${index + 1})`);

    // Siapkan data untuk worksheet
    const rows = [headers, secondHeaders];

    // Tambahkan data
    dataVoting.forEach((data, index) => {
      const row = [
        index + 1,
        data.Anggotum.nip,
        data.Anggotum.nama,
        // data.Anggotum.jabatan || '',
        // data.Voting1?.Pilihan1?.nama || '-',
        // data.Voting1?.Pilihan2?.nama || '-',
        // data.Voting1?.Pilihan3?.nama || '-',
        data.Voting1?.skor_pil1 || 0,
        data.Voting1?.skor_pil2 || 0,
        data.Voting1?.skor_pil3 || 0,
        data.Voting1?.total_skor || 0,
        // data.Voting1?.status_anggota || '-',
      ];
      rows.push(row);
    });

    // Tambah baris total partisipan
    const totalPartisipan = await Voting1.count({
      include: [{
        model: DetailPemilihan,
        where: { pemilihan_id: id }
      }]
    });

    rows.push([]);
    rows.push(['', '', 'Jumlah Voters:', totalPartisipan]);

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Set column widths
    const colWidths = [
      { wch: 5 },   // NO
      { wch: 12 },  // NIP
      { wch: 20 },  // NAMA
      // { wch: 30 },  // JABATAN
      // { wch: 30 },  // PILIHAN 1
      // { wch: 30 },  // PILIHAN 2
      // { wch: 30 },  // PILIHAN 3
      { wch: 15 },  // SKOR PILIHAN 1
      { wch: 15 },  // SKOR PILIHAN 2
      { wch: 15 },  // SKOR PILIHAN 3
      { wch: 12 },  // TOTAL SKOR
      // { wch: 15 }   // STATUS
    ];
    ws['!cols'] = colWidths;

    // Style untuk seluruh cell
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < headers.length; j++) {
        const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
        if (!ws[cellRef]) ws[cellRef] = {};
        if (!ws[cellRef].s) ws[cellRef].s = {};
        
        // Basic style untuk semua cell
        ws[cellRef].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };

        // Bold untuk header dan second header
        if (i <= 1) {
          ws[cellRef].s.font = { bold: true };
        }
      }
    }

    // Style untuk baris total partisipan
    const lastRowIndex = rows.length - 1;
    for (let j = 0; j < headers.length; j++) {
      const cellRef = XLSX.utils.encode_cell({ r: lastRowIndex, c: j });
      if (j === 4 || j === 5) { // Kolom "Jumlah Partisipan" dan nilainya
        ws[cellRef].s.font = { bold: true };
      }
    }

    // Tambah worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, ws, 'Laporan Voting 1');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=laporan_voting1_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error generating laporan voting 1:', error);
    next(error);
  }
};

// Laporan Penilain Kriteria/Hasil Akhir Pemilihan
const generateLaporanPenilaianKriteria = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data dengan periode
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{ model: Periode }]
    });

    if (!pemilihan) {
      return res.status(404).send('Pemilihan tidak ditemukan');
    }

    // Get jumlah indikator aktif
    const jumlahIndikator = await Voting2.count({
      where: { 
        '$DetailPemilihan.pemilihan_id$': id 
      },
      include: [{
        model: DetailPemilihan,
        required: true,
        attributes: []
      }],
      distinct: true,
      col: 'indikator_id'
    });

    // Get jumlah pengisi penilaian
    const jumlahPengisi = await DetailPemilihan.count({
      where: { pemilihan_id: id },
      include: [{
        model: Voting2,
        required: true,
        attributes: []
      }],
      distinct: true
    });

    // Get kandidat yang lolos
    const kandidat = await DetailPemilihan.findAll({
      where: { 
        pemilihan_id: id,
        '$Voting1.status_anggota$': 'lolos'
      },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama']
        },
        {
          model: Voting1,
          required: true,
          attributes: ['status_anggota']
        }
      ],
      group: ['DetailPemilihan.detail_pemilihan_id', 'Anggotum.nip', 'Anggotum.nama', 'Voting1.status_anggota']
    });

    // Hitung hasil kriteria
    const hasilKriteria = await Promise.all(kandidat.map(async (k) => {
      const totalPoin = await Voting2.sum('nilai', {
        where: { 
          kandidat_id: k.anggota_id,
          '$DetailPemilihan.pemilihan_id$': id,
        },
        include: [{
          model: DetailPemilihan,
          required: true,
          attributes: []
        }],
      });

      // Hitung rata-rata
      // ((total poin / jumlah pengisi) / (jumlah kriteria * 4)) * 100
      const rataRata = ((totalPoin / jumlahPengisi) / (jumlahIndikator * 4)) * 100;

      return {
        nama: k.Anggotum.nama,
        nip: k.Anggotum.nip,
        totalPoin,
        rataRata: parseFloat(rataRata.toFixed(2))
      };
    }));

    // Sort berdasarkan rata-rata tertinggi
    hasilKriteria.sort((a, b) => b.rataRata - a.rataRata);

    // Add posisi/ranking
    const hasilKriteriaFinal = hasilKriteria.map((hasil, index) => ({
      ...hasil,
      posisi: index + 1
    }));

    // Buat workbook baru
    const workbook = XLSX.utils.book_new();
    
    // Buat headers
    const headers = [
      'No', 'NIP', 'Nama', 'Jumlah Poin', 'Rata-Rata (%)'
    ];

    // Buat second headers dengan nomor kolom
    const secondHeaders = headers.map((_, index) => `(${index + 1})`);

    // Siapkan data untuk worksheet
    const rows = [headers, secondHeaders];

    // Tambahkan data
    hasilKriteriaFinal.forEach(data => {
      const row = [
        data.posisi,
        data.nip,
        data.nama,
        data.totalPoin,
        data.rataRata
      ];
      rows.push(row);
    });

    // Tambah informasi tambahan
    rows.push([]);
    rows.push(['','KETERANGAN:']);
    rows.push(['','Jumlah Indikator: ', jumlahIndikator]);
    rows.push(['','Jumlah Voters: ', jumlahPengisi]);

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Set column widths
    const colWidths = [
      { wch: 5 },   // NO
      { wch: 15 },  // NIP
      { wch: 20 },  // NAMA
      { wch: 15 },  // JUMLAH POIN
      { wch: 15 }   // RATA-RATA
    ];
    ws['!cols'] = colWidths;

    // Style untuk seluruh cell
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < headers.length; j++) {
        const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
        if (!ws[cellRef]) ws[cellRef] = {};
        if (!ws[cellRef].s) ws[cellRef].s = {};
        
        // Basic style untuk semua cell
        ws[cellRef].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };

        // Bold untuk header dan second header
        if (i <= 1) {
          ws[cellRef].s.font = { bold: true };
        }
      }
    }

    // Style untuk keterangan
    const startKeteranganRow = rows.length - 3;
    for (let i = startKeteranganRow; i < rows.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 });
      if (ws[cellRef]) {
        ws[cellRef].s.font = { bold: true };
        ws[cellRef].s.alignment = { horizontal: 'left' };
      }
    }

    // Tambah worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, ws, 'Penilaian Kriteria');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=laporan_penilaian_kriteria_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error generating laporan penilaian kriteria:', error);
    next(error);
  }
};

// rekap laporan pemilihan
const generateRekapLaporan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data dengan periode
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{ model: Periode }]
    });

    if (!pemilihan) {
      return res.status(404).send('Pemilihan tidak ditemukan');
    }

    // Buat workbook baru untuk rekap
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Data Nilai
    const dataNilai = await DetailPemilihan.findAll({
      where: { pemilihan_id: id },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama', 'jabatan']
        },
        {
          model: DataNilai,
          required: false
        }
      ],
      order: [['DataNilai', 'score_akhir', 'DESC']]
    });

    // Headers untuk sheet Data Nilai
    const headersNilai = [
      'NO', 'NIP', 'NAMA', 'JABATAN', 
      'NILAI CKP', 'NILAI ABSENSI', 'TOTAL SKOR', 'STATUS'
    ];
    const secondHeadersNilai = headersNilai.map((_, index) => `(${index + 1})`);
    const rowsNilai = [headersNilai, secondHeadersNilai];

    if (dataNilai.length > 0 && dataNilai.some(d => d.DataNilai)) {
      dataNilai.forEach((data, index) => {
        if (data.DataNilai) {
          rowsNilai.push([
            index + 1,
            data.Anggotum.nip,
            data.Anggotum.nama,
            data.Anggotum.jabatan || '',
            data.DataNilai.score_ckp,
            data.DataNilai.score_absen,
            data.DataNilai.score_akhir,
            data.DataNilai.status_anggota === 'eligible' ? 'Eligible' : 'Non-Eligible'
          ]);
        }
      });
    } else {
      rowsNilai.push([]);
      rowsNilai.push(['TIDAK ADA DATA PADA TAHAP PEMILIHAN INI']);
    }

    // Sheet 2: Voting 1
    const dataVoting1 = await DetailPemilihan.findAll({
      where: { 
        pemilihan_id: id,
        '$DataNilai.status_anggota$': 'eligible' 
      },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama']
        },
        {
          model: DataNilai,
          required: true,
          where: { status_anggota: 'eligible' }
        },
        {
          model: Voting1,
          required: false
        }
      ],
      order: [['Voting1', 'total_skor', 'DESC']]
    });

    const headersVoting1 = [
      'NO', 'NIP', 'NAMA',
      'SKOR PILIHAN 1', 'SKOR PILIHAN 2', 'SKOR PILIHAN 3',
      'TOTAL SKOR'
    ];
    const secondHeadersVoting1 = headersVoting1.map((_, index) => `(${index + 1})`);
    const rowsVoting1 = [headersVoting1, secondHeadersVoting1];

    if (dataVoting1.length > 0 && dataVoting1.some(d => d.Voting1)) {
      dataVoting1.forEach((data, index) => {
        rowsVoting1.push([
          index + 1,
          data.Anggotum.nip,
          data.Anggotum.nama,
          data.Voting1?.skor_pil1 || 0,
          data.Voting1?.skor_pil2 || 0,
          data.Voting1?.skor_pil3 || 0,
          data.Voting1?.total_skor || 0
        ]);
      });

      // Add total voters
      const totalVoters = await Voting1.count({
        include: [{
          model: DetailPemilihan,
          where: { pemilihan_id: id }
        }]
      });
      rowsVoting1.push([]);
      rowsVoting1.push(['', '', 'Jumlah Voters:', totalVoters]);
    } else {
      rowsVoting1.push([]);
      rowsVoting1.push(['TIDAK ADA DATA PADA TAHAP PEMILIHAN INI']);
    }

    // Sheet 3: Penilaian Kriteria
    const jumlahIndikator = await Voting2.count({
      where: { 
        '$DetailPemilihan.pemilihan_id$': id 
      },
      include: [{
        model: DetailPemilihan,
        required: true,
        attributes: []
      }],
      distinct: true,
      col: 'indikator_id'
    });

    const jumlahPengisi = await DetailPemilihan.count({
      where: { pemilihan_id: id },
      include: [{
        model: Voting2,
        required: true,
        attributes: []
      }],
      distinct: true
    });

    const kandidat = await DetailPemilihan.findAll({
      where: { 
        pemilihan_id: id,
        '$Voting1.status_anggota$': 'lolos'
      },
      include: [
        {
          model: Anggota,
          attributes: ['nip', 'nama']
        },
        {
          model: Voting1,
          required: true,
          where: { status_anggota: 'lolos' }
        }
      ]
    });

    const headersPenilaian = [
      'NO', 'NIP', 'NAMA', 'JUMLAH POIN', 'RATA-RATA (%)'
    ];
    const secondHeadersPenilaian = headersPenilaian.map((_, index) => `(${index + 1})`);
    const rowsPenilaian = [headersPenilaian, secondHeadersPenilaian];

    if (kandidat.length > 0) {
      // Hitung hasil kriteria
      const hasilKriteria = await Promise.all(kandidat.map(async (k) => {
        const totalPoin = await Voting2.sum('nilai', {
          where: { 
            kandidat_id: k.anggota_id,
            '$DetailPemilihan.pemilihan_id$': id,
          },
          include: [{
            model: DetailPemilihan,
            required: true,
            attributes: []
          }],
        });

        const rataRata = ((totalPoin / jumlahPengisi) / (jumlahIndikator * 4)) * 100;

        return {
          nama: k.Anggotum.nama,
          nip: k.Anggotum.nip,
          totalPoin,
          rataRata: parseFloat(rataRata.toFixed(2))
        };
      }));

      hasilKriteria.sort((a, b) => b.rataRata - a.rataRata);

      hasilKriteria.forEach((data, index) => {
        rowsPenilaian.push([
          index + 1,
          data.nip,
          data.nama,
          data.totalPoin,
          data.rataRata
        ]);
      });

      rowsPenilaian.push([]);
      rowsPenilaian.push(['', 'KETERANGAN:']);
      rowsPenilaian.push(['', 'Jumlah Indikator:', jumlahIndikator]);
      rowsPenilaian.push(['', 'Jumlah Voters:', jumlahPengisi]);
    } else {
      rowsPenilaian.push([]);
      rowsPenilaian.push(['TIDAK ADA DATA PADA TAHAP PEMILIHAN INI']);
    }

    // Buat dan style worksheets
    const sheets = [
      { name: 'Data Nilai', rows: rowsNilai },
      { name: 'Voting 1', rows: rowsVoting1 },
      { name: 'Penilaian Kriteria', rows: rowsPenilaian }
    ];

    sheets.forEach(sheet => {
      const ws = XLSX.utils.aoa_to_sheet(sheet.rows);

      // Set column widths
      const colWidths = Array(sheet.rows[0].length).fill({ wch: 15 });
      colWidths[0] = { wch: 5 }; // NO
      colWidths[1] = { wch: 15 }; // NIP
      colWidths[2] = { wch: 20 }; // NAMA
      ws['!cols'] = colWidths;

      // Style cells
      for (let i = 0; i < sheet.rows.length; i++) {
        for (let j = 0; j < sheet.rows[0].length; j++) {
          const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
          if (!ws[cellRef]) ws[cellRef] = {};
          if (!ws[cellRef].s) ws[cellRef].s = {};

          ws[cellRef].s = {
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          };

          // Bold untuk header dan pesan tidak ada data
          if (i <= 1 || sheet.rows[i][0] === 'TIDAK ADA DATA PADA TAHAP PEMILIHAN INI') {
            ws[cellRef].s.font = { bold: true };
          }
        }
      }

      XLSX.utils.book_append_sheet(workbook, ws, sheet.name);
    });

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=REKAP_LAPORAN_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error generating rekap laporan:', error);
    next(error);
  }
};

module.exports = {
  terimakasih,
  downloadTemplatePenilaian,
  generateLaporanDataNilai,
  generateLaporanVoting1,
  generateLaporanPenilaianKriteria,
  generateRekapLaporan,
};
