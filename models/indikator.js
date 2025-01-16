// models/indikator.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Indikator = sequelize.define('Indikator', {
    indikator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    isi_indikator: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipe_indikator: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status_inditakor: {
      type: DataTypes.ENUM('aktif', 'nonaktif'),
      allowNull: false,
      defaultValue: 'aktif'
    }
  }, {
    tableName: 'indikator',
    timestamps: false
  });

  Indikator.associate = function(models) {
    Indikator.hasMany(models.Voting2, {
      foreignKey: 'indikator_id'
    });
  };

  return Indikator;
};
