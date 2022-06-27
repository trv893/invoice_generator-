var DataTypes = require("sequelize").DataTypes;
var _dbo_customers = require("./dbo_customers");
var _dbo_invoicelines = require("./dbo_invoicelines");
var _dbo_invoices = require("./dbo_invoices");
var _dbo_proposals = require("./dbo_proposals");
var _dbo_rolepermissions = require("./dbo_rolepermissions");
var _dbo_settings = require("./dbo_settings");

function initModels(sequelize) {
  var dbo_customers = _dbo_customers(sequelize, DataTypes);
  var dbo_invoicelines = _dbo_invoicelines(sequelize, DataTypes);
  var dbo_invoices = _dbo_invoices(sequelize, DataTypes);
  var dbo_proposals = _dbo_proposals(sequelize, DataTypes);
  var dbo_rolepermissions = _dbo_rolepermissions(sequelize, DataTypes);
  var dbo_settings = _dbo_settings(sequelize, DataTypes);

  dbo_invoices.belongsTo(dbo_customers, { as: "Invoice_Customer_dbo_customer", foreignKey: "Invoice_Customer"});
  dbo_customers.hasMany(dbo_invoices, { as: "dbo_invoices", foreignKey: "Invoice_Customer"});
  dbo_proposals.belongsTo(dbo_customers, { as: "Proposal_Customer_dbo_customer", foreignKey: "Proposal_Customer"});
  dbo_customers.hasMany(dbo_proposals, { as: "dbo_proposals", foreignKey: "Proposal_Customer"});
  dbo_invoicelines.belongsTo(dbo_invoices, { as: "InvoiceLines_Invoice_dbo_invoice", foreignKey: "InvoiceLines_Invoice"});
  dbo_invoices.hasMany(dbo_invoicelines, { as: "dbo_invoicelines", foreignKey: "InvoiceLines_Invoice"});

  return {
    dbo_customers,
    dbo_invoicelines,
    dbo_invoices,
    dbo_proposals,
    dbo_rolepermissions,
    dbo_settings,
  };
} 
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
