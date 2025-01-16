// models/voting2.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Voting2 = sequelize.define('Voting2', {
    voting2_id: {
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
    indikator_id: {
      type: DataTypes.INTEGER
    },
    kandidat_id: {
      type: DataTypes.STRING(50)
    },
    nilai: {
      type: DataTypes.INTEGER
    },
    waktu_vot2: {
      type: DataTypes.DATE
    },
    status_vot2: {
      type: DataTypes.ENUM('berjalan', 'selesai'),
      allowNull: false,
      defaultValue: 'berjalan'
    }
  }, {
    tableName: 'voting2',
    timestamps: false
  });

  Voting2.associate = function(models) {
    Voting2.belongsTo(models.DetailPemilihan, {
      foreignKey: 'detail_pemilihan_id'
    });
    Voting2.belongsTo(models.Indikator, {
      foreignKey: 'indikator_id'
    });
    Voting2.belongsTo(models.Anggota, {
      foreignKey: 'kandidat_id',
      as: 'Kandidat'
    });
  };

  return Voting2;
};