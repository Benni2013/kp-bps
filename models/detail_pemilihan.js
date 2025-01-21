// models/detail_pemilihan.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const DetailPemilihan = sequelize.define('DetailPemilihan', {
    detail_pemilihan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    pemilihan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    anggota_id: {
      type: DataTypes.STRING(50)
    }
  }, {
    tableName: 'detail_pemilihan',
    timestamps: false
  });

  DetailPemilihan.associate = function(models) {
    DetailPemilihan.belongsTo(models.Pemilihan, {
      foreignKey: 'pemilihan_id'
    });
    DetailPemilihan.belongsTo(models.Anggota, {
      foreignKey: 'anggota_id'
    });
    DetailPemilihan.hasOne(models.DataNilai, {
      foreignKey: 'detail_pemilihan_id'
    });
    DetailPemilihan.hasOne(models.Voting1, {
      foreignKey: 'detail_pemilihan_id'
    });
    DetailPemilihan.hasMany(models.Voting2, {
      foreignKey: 'detail_pemilihan_id'
    });
  };

  return DetailPemilihan;
};