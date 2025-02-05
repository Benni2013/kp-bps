// models/pemilihan.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pemilihan = sequelize.define('Pemilihan', {
    pemilihan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    nama_pemilihan: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    periode_id: {
      type: DataTypes.INTEGER
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tanggal_mulai: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tahap_pemilihan: {
      type: DataTypes.ENUM('datanilai', 'voting1',  'voting2', 'tutup', 'selesai'),
      allowNull: false,
      defaultValue: 'berjalan'
    }
  }, {
    tableName: 'pemilihan',
    timestamps: false
  });

  Pemilihan.associate = function(models) {
    Pemilihan.belongsTo(models.Periode, {
      foreignKey: 'periode_id'
    });
    Pemilihan.hasMany(models.DetailPemilihan, {
      foreignKey: 'pemilihan_id'
    });
  };

  return Pemilihan;
};