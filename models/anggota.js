// models/anggota.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Anggota = sequelize.define('Anggota', {
    nip: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('biasa', 'supervisor', 'admin'),
      allowNull: false,
      defaultValue: 'biasa'
    },
    gender: {
      type: DataTypes.ENUM('pria', 'wanita')
    },
    divisi: {
      type: DataTypes.STRING(100)
    },
    jabatan: {
      type: DataTypes.STRING(255)
    },
    foto: {
      type: DataTypes.STRING(500)
    },
    status_anggota: {     // untuk status eligible voters
      type: DataTypes.ENUM('aktif', 'nonaktif'),
      allowNull: true,
      defaultValue: 'aktif'
    },
    status_karyawan: {    // untuk status karyawan
      type: DataTypes.ENUM('aktif', 'nonaktif'),
      allowNull: false,
      defaultValue: 'aktif',
    },
  }, {
    tableName: 'anggota',
    timestamps: false
  });

  Anggota.associate = function(models) {
    Anggota.hasMany(models.DetailPemilihan, {
      foreignKey: 'anggota_id'
    });
    Anggota.hasMany(models.Voting1, {
      foreignKey: 'pilihan1'
    });
    Anggota.hasMany(models.Voting1, {
      foreignKey: 'pilihan2'
    });
    Anggota.hasMany(models.Voting1, {
      foreignKey: 'pilihan3'
    });
    Anggota.hasMany(models.Voting2, {
      foreignKey: 'kandidat_id'
    });
  };

  return Anggota;
};
