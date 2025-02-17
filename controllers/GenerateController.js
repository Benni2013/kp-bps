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
const { Op } = require("sequelize");
const PDFDocument = require("pdfkit");
const XLSX = require('xlsx');
const Excel = require('exceljs');
const path = require("path");
const fs = require("fs");

const terimakasih = async (req, res, next) => {
  try {
    let pemilihan = await Pemilihan.findOne({
      where: {
        [Op.or]: [
          {tahap_pemilihan: "voting2"},
          {tahap_pemilihan: "selesai"},
          ],
      },
      order: [["tanggal_mulai", "DESC"]],
      include: [
        {
          model: Periode,
          required: true,
        },
      ],
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
    const fileName = `bukti-voting-${akun.nama}_${Date.now()}.pdf`;
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
    doc.moveDown();
    doc.text("Dengan ini kami sampaikan ucapan terima kasih atas partisipasi Anda dalam pemilihan: ");
    doc.text("Nama Pemilihan : " + pemilihan.nama_pemilihan);
    doc.text("Periode               : " + pemilihan.Periode.nama_periode + " Tahun " + pemilihan.tahun);
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
    // res.redirect("users/beranda");
    next(error);
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
  colWidths[3] = { wch: 25 }; // Jabatan

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

    // Create workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Data Nilai');
    
    // Buat headers
    const headers = [
      'No', 'NIP', 'Nama', 'Jabatan', 
      'Score CKP', 'Score Absen', 'Skor Akhir', 'Status'
    ];

    // Buat second headers dengan nomor kolom
    const secondHeaders = headers.map((_, index) => `(${index + 1})`);

    // Add headers to worksheet
    worksheet.addRow(headers);
    worksheet.addRow(secondHeaders);

    // Tambahkan data
    dataNilai.forEach((data, index) => {
      worksheet.addRow([
        index + 1,
        data.Anggotum.nip,
        data.Anggotum.nama,
        data.Anggotum.jabatan || '',
        data.DataNilai.score_ckp,
        data.DataNilai.score_absen,
        data.DataNilai.score_akhir,
        data.DataNilai.status_anggota === 'eligible' ? 'Eligible' : 'Non-Eligible'
      ]);
    });

    // Set column widths
    worksheet.columns = [
      { width: 5 },  // NO
      { width: 15 }, // NIP
      { width: 20 }, // NAMA
      { width: 30 }, // JABATAN
      { width: 12 }, // NILAI CKP
      { width: 15 }, // NILAI ABSENSI
      { width: 12 }, // TOTAL SKOR
      { width: 15 }  // STATUS
    ];
    

    // Style cells
    worksheet.eachRow((row, rowNumber) => {
      row.height = 25; // Set row height
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Bold for headers
        if (rowNumber <= 2) {
          cell.font = { bold: true };
        }
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=laporan_data_nilai_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(buffer);

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

    // Create workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Voting 1');
    
    // Buat headers
    const headers = [
      'No', 'NIP', 'Nama', /* 'JABATAN',
      'PILIHAN 1', 'PILIHAN 2', 'PILIHAN 3', */
      'Skor Pilihan 1', 'Skor Pilihan 2', 'Skor Pilihan 3',
      'Total Skor', // 'STATUS'
    ];

    // Buat second headers dengan nomor kolom
    const secondHeaders = headers.map((_, index) => `(${index + 1})`);

    // Add headers
    worksheet.addRow(headers);
    worksheet.addRow(secondHeaders);

    // Add data
    dataVoting.forEach((data, index) => {
      worksheet.addRow([
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
      ]);
    });

    // Tambah baris total partisipan
    const totalPartisipan = await Voting1.count({
      include: [{
        model: DetailPemilihan,
        where: { pemilihan_id: id }
      }]
    });

    worksheet.addRow([]);
    worksheet.addRow(['', '', 'Jumlah Voters:', totalPartisipan]);

    // Set column widths
    worksheet.columns = [
      { width: 5 },   // NO
      { width: 15 },  // NIP
      { width: 20 },  // NAMA
      // { width: 30 },  // JABATAN
      // { width: 30 },  // PILIHAN 1
      // { width: 30 },  // PILIHAN 2
      // { width: 30 },  // PILIHAN 3
      { width: 15 },  // SKOR PILIHAN 1
      { width: 15 },  // SKOR PILIHAN 2
      { width: 15 },  // SKOR PILIHAN 3
      { width: 12 },  // TOTAL SKOR
      // { width: 15 }   // STATUS
    ];

    // Style untuk seluruh cell
    worksheet.eachRow((row, rowNumber) => {
      row.height = 25;
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Bold for headers and total row
        if (rowNumber <= 2 || rowNumber === worksheet.rowCount) {
          cell.font = { bold: true };
        }
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=laporan_voting1_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(buffer);

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

    // Create workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Penilaian Kriteria');
    
    // Buat headers
    const headers = [
      'No', 'NIP', 'Nama', 'Jumlah Poin', 'Rata-Rata (%)'
    ];

    // Buat second headers dengan nomor kolom
    const secondHeaders = headers.map((_, index) => `(${index + 1})`);

    // Add headers
    worksheet.addRow(headers);
    worksheet.addRow(secondHeaders);

    // Add data
    hasilKriteriaFinal.forEach(data => {
      worksheet.addRow([
        data.posisi,
        data.nip,
        data.nama,
        data.totalPoin,
        data.rataRata
      ]);
    });

    // Add keterangan
    worksheet.addRow([]);
    worksheet.addRow(['', 'KETERANGAN:']);
    worksheet.addRow(['', 'Jumlah Indikator:', jumlahIndikator]);
    worksheet.addRow(['', 'Jumlah Voters:', jumlahPengisi]);

    // Set column widths
    worksheet.columns = [
      { width: 5 },   // NO
      { width: 15 },  // NIP
      { width: 20 },  // NAMA
      { width: 15 },  // JUMLAH POIN
      { width: 15 }   // RATA-RATA
    ];

    // Style cells
    worksheet.eachRow((row, rowNumber) => {
      row.height = 25;
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Bold for headers
        if (rowNumber <= 2) {
          cell.font = { bold: true };
        }
      });
    });

    // Style keterangan rows
    const keteranganStartRow = worksheet.rowCount - 3;
    for(let i = keteranganStartRow; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      row.getCell(2).alignment = { horizontal: 'left' };
      row.getCell(2).font = { bold: true };
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=laporan_penilaian_kriteria_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(buffer);

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

    // Create workbook
    const workbook = new Excel.Workbook();

    // Helper function to create and style worksheet
    const createWorksheet = (name, headers, data, options = {}) => {
      const worksheet = workbook.addWorksheet(name);
      
      // Add headers
      worksheet.addRow(headers);
      worksheet.addRow(headers.map((_, i) => `(${i + 1})`));

      // Add data
      if (data.length > 0) {
        data.forEach(row => worksheet.addRow(row));
        
        // Add additional info if exists
        if (options.additionalInfo) {
          worksheet.addRow([]);
          options.additionalInfo.forEach(info => worksheet.addRow(info));
        }
      } else {
        worksheet.addRow([]);
        worksheet.addRow(['TIDAK ADA DATA PADA TAHAP PEMILIHAN INI']);
      }

      // Set column widths
      worksheet.columns = [
        { width: 5 },  // NO
        { width: 15 }, // NIP
        { width: 20 }, // NAMA
        ...Array(headers.length - 3).fill({ width: 15 })
      ];

      // Style cells
      worksheet.eachRow((row, rowNumber) => {
        row.height = 25;
        row.alignment = { vertical: 'middle', horizontal: 'center' };
        
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          };

          // Bold for headers and special rows
          if (rowNumber <= 2 || 
              cell.value === 'TIDAK ADA DATA PADA TAHAP PEMILIHAN INI' ||
              (options.additionalInfo && rowNumber > worksheet.rowCount - options.additionalInfo.length)) {
            cell.font = { bold: true };
          }
        });
      });

      // Special alignment for additional info
      if (options.additionalInfo) {
        const startRow = worksheet.rowCount - options.additionalInfo.length + 1;
        for (let i = startRow; i <= worksheet.rowCount; i++) {
          worksheet.getRow(i).getCell(2).alignment = { horizontal: 'left' };
        }
      }

      return worksheet;
    };

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

    const dataNilaiRows = dataNilai
      .filter(d => d.DataNilai)
      .map((data, index) => [
        index + 1,
        data.Anggotum.nip,
        data.Anggotum.nama,
        data.Anggotum.jabatan || '',
        data.DataNilai.score_ckp,
        data.DataNilai.score_absen,
        data.DataNilai.score_akhir,
        data.DataNilai.status_anggota === 'eligible' ? 'Eligible' : 'Non-Eligible'
      ]);
    
    createWorksheet('Data Nilai', headersNilai, dataNilaiRows);

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

    const totalVoters = await Voting1.count({
      include: [{
        model: DetailPemilihan,
        where: { pemilihan_id: id }
      }]
    });

    const dataVoting1Rows = dataVoting1
      .filter(d => d.Voting1)
      .map((data, index) => [
        index + 1,
        data.Anggotum.nip,
        data.Anggotum.nama,
        data.Voting1?.skor_pil1 || 0,
        data.Voting1?.skor_pil2 || 0,
        data.Voting1?.skor_pil3 || 0,
        data.Voting1?.total_skor || 0
      ]);

    createWorksheet('Voting 1', headersVoting1, dataVoting1Rows, {
      additionalInfo: [['', '', 'Jumlah Voters:', totalVoters]]
    });

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
    
    const dataPenilaianRows = hasilKriteria.map((data, index) => [
      index + 1,
      data.nip,
      data.nama,
      data.totalPoin,
      data.rataRata
    ]);

    createWorksheet('Penilaian Kriteria', headersPenilaian, dataPenilaianRows, {
      additionalInfo: [
        ['', 'KETERANGAN:'],
        ['', 'Jumlah Indikator:', jumlahIndikator],
        ['', 'Jumlah Voters:', jumlahPengisi]
      ]
    });

    // Generate buffer and send response
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename=REKAP_LAPORAN_${pemilihan.nama_pemilihan}_${pemilihan.Periode.nama_periode}_${pemilihan.tahun}.xlsx`
    );
    
    // Send file
    res.send(buffer);

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
