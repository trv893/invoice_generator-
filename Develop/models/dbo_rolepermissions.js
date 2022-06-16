const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dbo_rolepermissions', {
    RoleName: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "",
      primaryKey: true
    },
    PermissionId: {
      type: DataTypes.STRING(322),
      allowNull: false,
      defaultValue: "",
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'dbo_rolepermissions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "RoleName" },
          { name: "PermissionId", length: 255 },
        ]
      },
    ]
  });
};
