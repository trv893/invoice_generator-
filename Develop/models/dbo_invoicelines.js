const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dbo_invoicelines', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    InvoiceLines_Invoice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'dbo_invoices',
        key: 'Id'
      }
    }
  }, {
    sequelize,
    tableName: 'dbo_invoicelines',
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
      {
        name: "InvoiceLine_Invoice",
        using: "BTREE",
        fields: [
          { name: "InvoiceLines_Invoice" },
        ]
      },
    ]
  });
};
