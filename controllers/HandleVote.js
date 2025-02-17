// HandleVote

// - startVot1          (done)
// - getMonitorVot1     (done)
// - closeVot1          (done)
// - getKandidatPenilaianKeriteria (data hasil voting 1)         (done)
// - setKandidatPenilaianKeriteria (menentukan kandidat vote 2)  (done)
// - getMonitorVot2     (done)
// - closeVot2          (done)

const { 
  Pemilihan, 
  DetailPemilihan, 
  Voting1, 
  Voting2,
  Anggota,
  Periode,
  sequelize
} = require('../models');
const { Op } = require('sequelize');

// Mulai voting 1
const startVot1 = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get pemilihan data
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
    });

    if (!pemilihan) {
      return res.status(404).redirect('/admin/pemilihan_berlangsung');
    }

    if (pemilihan.tahap_pemilihan === 'voting2' || pemilihan.tahap_pemilihan === 'selesai') {
      return res.redirect(`/admin/pemilihan_berlangsung/${id}/monitor_voting1`);
    }
    
    await Pemilihan.update({
      tahap_pemilihan: 'voting1'
    }, {
      where: { pemilihan_id: id }
    });  

    res.redirect(`/admin/pemilihan_berlangsung/${id}/monitor_voting1`);
  } catch (error) {
    console.error('Error starting voting 1:', error);
    next(error);
  }
};

// get data untuk monitor voting 1
const getMonitorVot1 = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { filter } = req.query;

    // Get pemilihan data
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{ model: Periode }]
    });

    if (!pemilihan) {
      return res.status(404).redirect('/admin/pemilihan_berlangsung');
    }

    // Redirect if not in voting1 phase
    if (pemilihan.tahap_pemilihan === 'datanilai') {
      return res.redirect(`/admin/pemilihan_berlangsung/${id}/input_penilaian`);
    }

    const pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} ${pemilihan.tahun}`;

    // Get total pemilih (semua anggota aktif non-admin)
    const totalPemilih = await DetailPemilihan.count({
      where: { pemilihan_id: id },
      include: [{
        model: Anggota,
        where: {
          role: { [Op.ne]: 'admin' },
          status_anggota: 'aktif'
        }
      }]
    });

    // Get jumlah yang sudah voting
    let sudahVote = await Voting1.count({
      include: [{
        model: DetailPemilihan,
        where: { pemilihan_id: id },
        include: [{
          model: Anggota,
          where: {
            role: { [Op.ne]: 'admin' },
            status_anggota: 'aktif'
          }
        }],
      }]
    });

    // Normalisasi sudahVote dan belumVote
    sudahVote = Math.min(sudahVote, totalPemilih);
    const belumVote = Math.max(0, totalPemilih - sudahVote);
    const progressPercentage = Math.min(100, Math.round((sudahVote / totalPemilih) * 100));

    // Update skor voting
    const voteCounts = {
      pilihan1: {},
      pilihan2: {},
      pilihan3: {}
    };

    // Hitung skor untuk setiap pilihan
    for (const field of ['pilihan1', 'pilihan2', 'pilihan3']) {
      const votes = await Voting1.findAll({
        include: [{
          model: DetailPemilihan,
          where: { pemilihan_id: id }
        }],
        attributes: [
          [field, 'nip'],
          [sequelize.fn('COUNT', sequelize.col('voting1_id')), 'count']
        ],
        group: [field],
        having: {
          [field]: { [Op.ne]: null }
        },
        transaction
      });

      votes.forEach(vote => {
        const nip = vote.get('nip');
        voteCounts[field][nip] = parseInt(vote.get('count'));
      });
    }

    // Get data anggota dengan status voting
    let whereClause = { pemilihan_id: id };
    let includeVoting = {
      model: Voting1,
      required: false
    };

    if (filter === 'sudah') {
      includeVoting.required = true;
    } else if (filter === 'belum') {
      whereClause['$Voting1.voting1_id$'] = null;
    }

    const detailPemilihan = await DetailPemilihan.findAll({
      where: whereClause,
      include: [
        {
          model: Anggota,
          where: {
            role: { [Op.ne]: 'admin' },
            status_anggota: 'aktif'
          },
          attributes: ['nip', 'nama']
        },
        includeVoting
      ],
      transaction,
      order: [['Anggotum', 'nama', 'ASC']]
    });

    // console.log("\nDetail Pemilih");
    // console.log(JSON.stringify(detailPemilihan, null, 2));

    await Promise.all(detailPemilihan.map(async (detail) => {
      if (detail.Voting1) {
        const nip = detail.anggota_id;
        const skor_pil1 = (voteCounts.pilihan1[nip] || 0) * 3;
        const skor_pil2 = (voteCounts.pilihan2[nip] || 0) * 2;
        const skor_pil3 = (voteCounts.pilihan3[nip] || 0) * 1;
        const total_skor = skor_pil1 + skor_pil2 + skor_pil3;

        await Voting1.update({
          skor_pil1,
          skor_pil2,
          skor_pil3,
          total_skor
        }, {
          where: { voting1_id: detail.Voting1.voting1_id },
          transaction
        });
      }
    }));

    // Get top 3 sementara berdasarkan total skor
    const top3Sementara = await Voting1.findAll({
      include: [{
        model: DetailPemilihan,
        where: { pemilihan_id: id },
        include: [{
          model: Anggota,
          attributes: ['nama']
        }]
      }],
      order: [['total_skor', 'DESC']],
      limit: 3,
      transaction
    });

    const top3Data = top3Sementara.map(v => ({
      nama: v.DetailPemilihan.Anggotum.nama,
      totalSkor: v.total_skor,
      skor: {
        pilihan1: v.skor_pil1,
        pilihan2: v.skor_pil2,
        pilihan3: v.skor_pil3
      }
    }));

    await transaction.commit();

    // Format data untuk view
    const anggotaList = detailPemilihan.map((detail, index) => ({
      no: index + 1,
      nama: detail.Anggotum.nama,
      nip: detail.Anggotum.nip,
      sudahVote: !!detail.Voting1,
      waktu: detail.Voting1 ? detail.Voting1.waktu_vot1 : '-'
    }));

    res.render('admin/pemilihan_berlangsung/monitor_voting1', {
      title: 'Monitor Voting 1',
      layout: 'layouts/admin.hbs',
      pemilihanTitle,
      votingStatus: {
        isVotingOpen: pemilihan.tahap_pemilihan === 'voting1',
        totalPemilih,
        sudahVote,
        belumVote,
        progressPercentage
      },
      anggota: anggotaList,
      top3Sementara: top3Data,
      selectedFilter: filter,
      idPemilihan: id,
      akun: req.user,
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error getting monitor voting 1:', error);
    next(error);
  }
};

// Tutup voting 1
const closeVot1 = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Get semua detail pemilihan untuk pemilihan ini
    const detailPemilihan = await DetailPemilihan.findAll({
      where: { pemilihan_id: id },
      include: [
        {
          model: Voting1,
          required: false
        }
      ]
    });

    // console.log("\nDetail Pemilihan");
    // console.log(JSON.stringify(detailPemilihan, null, 2));

    // Hitung votes untuk setiap pilihan
    const voteCount = await Voting1.findAll({
      include: [{
        model: DetailPemilihan,
        where: { pemilihan_id: id }
      }],
      attributes: [
        ['pilihan1', 'nip'],
        [sequelize.fn('COUNT', sequelize.col('voting1_id')), 'count']
      ],
      group: ['pilihan1']
    });

    // console.log("\nVote Count");
    // console.log(JSON.stringify(voteCount, null, 2));

    const voteCounts = {
      pilihan1: {},
      pilihan2: {},
      pilihan3: {}
    };

    // Process vote counts
    for (const field of ['pilihan1', 'pilihan2', 'pilihan3']) {
      const votes = await Voting1.findAll({
        include: [{
          model: DetailPemilihan,
          where: { pemilihan_id: id }
        }],
        attributes: [
          [field, 'nip'],
          [sequelize.fn('COUNT', sequelize.col('voting1_id')), 'count']
        ],
        group: [field],
        having: {
          [field]: { [Op.ne]: null }
        }
      });

      // console.log(`\nVotes for ${field}`);
      // console.log(JSON.stringify(votes, null, 2));

      votes.forEach(vote => {
        const nip = vote.get('nip');
        voteCounts[field][nip] = parseInt(vote.get('count'));
      });
    }

    // Update skor untuk setiap anggota
    const updatePromises = detailPemilihan.map(async (detail) => {
      const nip = detail.anggota_id;
      const skor_pil1 = (voteCounts.pilihan1[nip] || 0) * 3;
      const skor_pil2 = (voteCounts.pilihan2[nip] || 0) * 2;
      const skor_pil3 = (voteCounts.pilihan3[nip] || 0) * 1;

      if (detail.Voting1) {
        return Voting1.update({
          skor_pil1,
          skor_pil2,
          skor_pil3
        }, {
          where: { voting1_id: detail.Voting1.voting1_id },
          transaction
        });
      }
    });

    await Promise.all(updatePromises);

    // Update tahap pemilihan
    await Pemilihan.update({
      tahap_pemilihan: 'voting2'
    }, {
      where: { pemilihan_id: id },
      transaction
    });

    await transaction.commit();
    res.json({ 
      success: true, 
      message: 'Voting 1 berhasil ditutup' 
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error closing voting 1:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menutup voting 1'
    });
  }
};

// get kandidat penilaian kriteria
const getKandidatPenilaianKriteria = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
  
      // Get pemilihan dengan periode
      const pemilihan = await Pemilihan.findOne({
        where: { pemilihan_id: id },
        include: [{ model: Periode }]
      });
  
      if (!pemilihan) {
        return res.status(404).redirect('/admin/pemilihan_berlangsung');
      }
  
      const pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} ${pemilihan.tahun}`;

      // Get detail pemilihan ids untuk pemilihan ini
      const detailPemilihanIds = await DetailPemilihan.findAll({
        where: { pemilihan_id: id },
        attributes: ['detail_pemilihan_id']
      });

      const detailIds = detailPemilihanIds.map(d => d.detail_pemilihan_id);

      // Update total_skor untuk semua voting1
      await Voting1.update(
        {
          total_skor: sequelize.literal('skor_pil1 + skor_pil2 + skor_pil3')
        },
        {
          where: {
            detail_pemilihan_id: {
              [Op.in]: detailIds
            }
          },
          transaction
        }
      );

      console.log('\nTotal skor updated');
  
      // Get kandidat dengan total skor
      const kandidat = await Voting1.findAll({
        where: {
          detail_pemilihan_id: {
            [Op.in]: detailIds
          },
          total_skor: {
            [Op.gt]: 0
          }
        },
        include: [{
          model: DetailPemilihan,
          required: true,
          include: [{
            model: Anggota,
            attributes: ['nip', 'nama', 'jabatan']
          }]
        }],
        attributes: [
          'voting1_id',
          'skor_pil1',
          'skor_pil2',
          'skor_pil3',
          'total_skor',
          'status_anggota'
        ],
        order: [['total_skor', 'DESC']],
        transaction
      });
  
      // console.log('\nData Kandidat:');
      // console.log(JSON.stringify(kandidat, null, 2));
  
      // Format data untuk view
      const kandidatData = kandidat.map((k, index) => ({
        id: k.voting1_id,
        no: index + 1,
        nama: k.DetailPemilihan.Anggotum.nama,
        nip: k.DetailPemilihan.Anggotum.nip,
        jabatan: k.DetailPemilihan.Anggotum.jabatan,
        skor1: k.skor_pil1,
        skor2: k.skor_pil2,
        skor3: k.skor_pil3,
        total: k.total_skor,
        status: k.status_anggota
      }));

      await transaction.commit();
  
      res.render('admin/pemilihan_berlangsung/kandidat_penilaian_kriteria', {
        title: 'Kandidat Penilaian Kriteria',
        layout: 'layouts/admin.hbs',
        pemilihanTitle,
        kandidat: kandidatData,
        idPemilihan: id,
        akun: req.user,
      });
  
    } catch (error) {
      await transaction.rollback();
      console.error('Error getting kandidat penilaian kriteria:', error);
      next(error);
    }
};

// set status untuk kandidat penilaian kriteria
const setKandidatPenilaianKriteria = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const formData = req.body;

    // // Check apakah sudah ada yang memiliki status_anggota
    // const hasStatusAnggota = await Voting1.findOne({
    //   where: {
    //     '$DetailPemilihan.pemilihan_id$': id,
    //     status_anggota: { [Op.ne]: null }
    //   },
    //   include: [{
    //     model: DetailPemilihan,
    //     required: true
    //   }]
    // });

    // // Jika sudah ada status, redirect ke monitor voting 2
    // if (hasStatusAnggota) {
    //   console.log('\nStatus anggota sudah ada, redirect ke monitor voting 2');
    //   return res.redirect(`/admin/pemilihan_berlangsung/${id}/monitor_voting2`);
    // }

    // Get semua voting1 untuk pemilihan ini
    const voting1Data = await Voting1.findAll({
      where: {
        '$DetailPemilihan.pemilihan_id$': id
      },
      include: [{
        model: DetailPemilihan,
        required: true
      }]
    });

    // console.log('\nForm Data:');
    // console.log(JSON.stringify(formData, null, 2));

    // Update status untuk setiap kandidat
    const updatePromises = voting1Data.map(async (voting) => {
      const isSelected = formData[`kandidat_${voting.voting1_id}`] === 'on';
      
      return Voting1.update({
        status_anggota: isSelected ? 'lolos' : 'gugur'
      }, {
        where: { voting1_id: voting.voting1_id },
        transaction
      });
    });

    // Find detail pemilihan ids
    const detailPemilihanIds = await DetailPemilihan.findAll({
      where: { pemilihan_id: id },
      attributes: ['detail_pemilihan_id']
    });

    const ids = detailPemilihanIds.map(d => d.detail_pemilihan_id);

    // Hapus data voting2 yang sudah ada
    await Voting2.destroy({
      where: { detail_pemilihan_id: { [Op.in]: ids } },
      transaction,
    });

    await Pemilihan.update({
      tahap_pemilihan: 'voting2'
    }, {
      where: { pemilihan_id: id },
      transaction
    });

    await Promise.all(updatePromises);
    await transaction.commit();

    console.log('\nStatus kandidat berhasil diupdate');
    res.redirect(`/admin/pemilihan_berlangsung/${id}/monitor_voting2`);

  } catch (error) {
    await transaction.rollback();
    console.error('Error setting kandidat status:', error);
    next(error);
  }
};

// Get monitor voting 2
const getMonitorVot2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filter } = req.query;

    // Get pemilihan data
    const pemilihan = await Pemilihan.findOne({
      where: { pemilihan_id: id },
      include: [{ model: Periode }]
    });

    if (!pemilihan) {
      return res.status(404).redirect('/admin/pemilihan_berlangsung');
    }

    if (pemilihan.tahap_pemilihan === 'voting1') {
      return res.redirect(`/admin/pemilihan_berlangsung/${id}/monitor_voting1`);
    } else if (pemilihan.tahap_pemilihan === 'datanilai') {
      return res.redirect(`/admin/pemilihan_berlangsung/${id}/input_penilaian`);
    }

    const pemilihanTitle = `${pemilihan.nama_pemilihan} ${pemilihan.Periode.nama_periode} ${pemilihan.tahun}`;

    // Get total pengisi (semua anggota aktif non-admin)
    const totalPengisi = await DetailPemilihan.count({
      where: { pemilihan_id: id },
      include: [{
        model: Anggota,
        where: {
          role: { [Op.ne]: 'admin' },
          status_anggota: 'aktif'
        }
      }]
    });

    // Get jumlah yang sudah mengisi (distinct detail_pemilihan_id)
    let sudahIsi = await DetailPemilihan.count({
      where: { pemilihan_id: id },
      include: [{
        model: Voting2,
        required: true,
        attributes: []
      },
      {
        model: Anggota,
        where: {
          role: { [Op.ne]: 'admin' },
          status_anggota: 'aktif'
        }
      }
    ],
      distinct: true
    });

    // Normalisasi sudahIsi dan belumIsi
    sudahIsi = Math.min(sudahIsi, totalPengisi);
    const belumIsi = Math.max(0, totalPengisi - sudahIsi);
    const progressPercentage = Math.min(100, Math.round((sudahIsi / totalPengisi) * 100));


    // Get data anggota dengan status pengisian
    let whereClause = { pemilihan_id: id };
    let includeVoting = {
      model: Voting2,
      required: false,
      separate: true, // Gunakan separate: true untuk menghindari limit dari GROUP BY
      order: [['waktu_vot2', 'DESC']]
    };

    // Get unique detail_pemilihan_ids yang sudah mengisi
    const filledDetailPemilihanIds = await Voting2.findAll({
      attributes: ['detail_pemilihan_id'],
      group: ['detail_pemilihan_id']
    });

    const filledIds = filledDetailPemilihanIds.map(v => v.detail_pemilihan_id);

    // Terapkan filter
    if (filter === 'sudah') {
      whereClause.detail_pemilihan_id = { [Op.in]: filledIds };
    } else if (filter === 'belum') {
      whereClause.detail_pemilihan_id = { [Op.notIn]: filledIds };
    }

    const detailPemilihan = await DetailPemilihan.findAll({
      where: whereClause,
      include: [
        {
          model: Anggota,
          where: {
            role: { [Op.ne]: 'admin' },
            status_anggota: 'aktif'
          },
          attributes: ['nip', 'nama']
        },
        includeVoting
      ],
      order: [['Anggotum', 'nama', 'ASC']]
    });

    // Format data untuk view
    const anggotaList = detailPemilihan.map((detail, index) => {
      const hasVoted = detail.Voting2s && detail.Voting2s.length > 0;
      const latestVoting = hasVoted ? detail.Voting2s[0] : null;

      return {
        no: index + 1,
        nama: detail.Anggotum.nama,
        nip: detail.Anggotum.nip,
        sudahMengisi: hasVoted,
        waktu: hasVoted ? 
          new Date(latestVoting.waktu_vot2) : 
          '-'
      };
    });

    // console.log('\nData Monitor Voting 2:');
    // console.log(JSON.stringify({
    //   pemilihanTitle,
    //   votingStatus: {
    //     isVotingOpen: pemilihan.tahap_pemilihan === 'voting2',
    //     totalPengisi,
    //     sudahIsi,
    //     belumIsi,
    //     progressPercentage
    //   },
    //   anggota: anggotaList
    // }, null, 2));

    res.render('admin/pemilihan_berlangsung/monitor_voting2', {
      title: 'Monitor Voting 2',
      layout: 'layouts/admin.hbs',
      pemilihanTitle,
      votingStatus: {
        isVotingOpen: pemilihan.tahap_pemilihan === 'voting2',
        totalPengisi,
        sudahIsi,
        belumIsi,
        progressPercentage
      },
      anggota: anggotaList,
      selectedFilter: filter,
      idPemilihan: id,
      akun: req.user,
    });

  } catch (error) {
    console.error('Error getting monitor voting 2:', error);
    next(error);
  }
};

// Close voting 2
const closeVot2 = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Update tahap pemilihan menjadi selesai
    await Pemilihan.update({
      tahap_pemilihan: 'selesai'
    }, {
      where: { pemilihan_id: id },
      transaction
    });

    await transaction.commit();
    res.json({ 
      success: true, 
      message: 'Penilaian Kriteria berhasil ditutup' 
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error closing voting 2:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menutup penilaian kriteria'
    });
  }
};


module.exports = {
  startVot1,
  getMonitorVot1,
  closeVot1,
  getKandidatPenilaianKriteria,
  setKandidatPenilaianKriteria,
  getMonitorVot2,
  closeVot2,
};