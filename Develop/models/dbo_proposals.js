const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dbo_proposals', {
    Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    JobName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ProposalDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    JobLocation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    JobPhone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Architect: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DateOfPlans: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    ProposalAmount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    },
    PaymentTerms: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ProposalText: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    WithdrawDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Roofing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    DateCreated: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00.000000"
    },
    Proposal_Customer: {
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
    tableName: 'dbo_proposals',
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
        name: "Invoice_Customer_idx",
        using: "BTREE",
        fields: [
          { name: "Proposal_Customer" },
        ]
      },
    ]
  });
};
