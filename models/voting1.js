// models/voting1.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Voting1 = sequelize.define('Voting1', {
    voting1_id: {
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
    pilihan1: {
      type: DataTypes.STRING(50)
    },
    pilihan2: {
      type: DataTypes.STRING(50)
    },
    pilihan3: {
      type: DataTypes.STRING(50)
    },
    skor_pil1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    skor_pil2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    skor_pil3: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_skor: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    waktu_vot1: {
      type: DataTypes.DATE
    },
    status_anggota: {
      type: DataTypes.ENUM('lolos', 'gugur')
    },
  }, {
    tableName: 'voting1',
    timestamps: false
  });

  Voting1.associate = function(models) {
    Voting1.belongsTo(models.DetailPemilihan, {
      foreignKey: 'detail_pemilihan_id'
    });
    Voting1.belongsTo(models.Anggota, {
      foreignKey: 'pilihan1',
      as: 'Pilihan1'
    });
    Voting1.belongsTo(models.Anggota, {
      foreignKey: 'pilihan2',
      as: 'Pilihan2'
    });
    Voting1.belongsTo(models.Anggota, {
      foreignKey: 'pilihan3',
      as: 'Pilihan3'
    });
  };

  return Voting1;
};