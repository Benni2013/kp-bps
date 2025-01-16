// models/data_nilai.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const DataNilai = sequelize.define('DataNilai', {
    data_nilai_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    detail_pemilihan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score_ckp: {
      type: DataTypes.FLOAT
    },
    score_absen: {
      type: DataTypes.FLOAT
    },
    score_akhir: {
      type: DataTypes.FLOAT,
      defaultValue: 0.00
    },
    status_anggota: {
      type: DataTypes.ENUM('non_eligible', 'eligible')
    },
    status_data_nilai: {
      type: DataTypes.ENUM('berjalan', 'selesai'),
      allowNull: false,
      defaultValue: 'berjalan'
    }
  }, {
    tableName: 'data_nilai',
    timestamps: false
  });

  DataNilai.associate = function(models) {
    DataNilai.belongsTo(models.DetailPemilihan, {
      foreignKey: 'detail_pemilihan_id'
    });
  };

  return DataNilai;
};