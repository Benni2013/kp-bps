// models/periode.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Periode = sequelize.define('Periode', {
    periode_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    nama_periode: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'periode',
    timestamps: false
  });

  Periode.associate = function(models) {
    Periode.hasMany(models.Pemilihan, {
      foreignKey: 'periode_id'
    });
  };

  return Periode;
};