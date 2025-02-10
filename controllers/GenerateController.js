// GenerateController

// - ucapan terimakasih
// - template penilaian  (done)
// - laporan kandidate eligible
// - laporan voting 1
// - laporan voting 2 (hasil akhir pemilihan)

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
  bulan.forEach(b => {
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
    console.log('\n Detail Pemilihan:', JSON.stringify(pemilihan, null, 2));

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

module.exports = {
  terimakasih,
  downloadTemplatePenilaian,
};
