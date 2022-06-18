const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dbo_customers', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    FirstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    LastName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Company: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Phone1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Phone2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Fax: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    State: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Zip: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    DateCreated: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00.000000"
    }
  }, {
    sequelize,
    tableName: 'dbo_customers',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
    ]
  })};
;
