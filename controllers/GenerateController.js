// GenerateController

// - ucapan terimakasih
// - template penilaian
// - laporan kandidate eligible
// - laporan voting 1
// - laporan voting 2 (hasil akhir pemilihan)

const jwt = require("jsonwebtoken");
const { Anggota, Pemilihan, DetailPemilihan, DataNilai, Voting1, Voting2, Indikator } = require("../models");
const PDFDocument = require("pdfkit");
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

module.exports = {
  terimakasih,
  getBulanPeriode,
};
