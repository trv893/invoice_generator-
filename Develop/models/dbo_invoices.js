const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dbo_invoices', {
    Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    InvoiceDate: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00.000000"
    },
    BillToName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    BillToAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BillToCity: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BillToState: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BillToZip: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Terms: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    Invoice_Customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'dbo_customers',
        key: 'Id'
      }
    }
  }, {
    sequelize,
    tableName: 'dbo_invoices',
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
        name: "fk_dbo_invoice_to_dbo_customer_idx",
        using: "BTREE",
        fields: [
          { name: "Invoice_Customer" },
        ]
      },
    ]
  });
};
