// GenerateController

// - ucapan terimakasih
// - template penilaian
// - laporan kandidate eligible
// - laporan voting 1
// - laporan voting 2 (hasil akhir pemilihan)


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
    getBulanPeriode,
}