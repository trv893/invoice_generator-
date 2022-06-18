const path = require('path');
const router = require('express').Router();
const db_customer_routes = require(path.join(__dirname,'/db_customer_routes'));
const db_invoice_routes = require(path.join(__dirname,'/db_invoice_routes'));
const db_proposal_routes = require(path.join(__dirname,'/db_proposal_routes'));

// expose api routes to the client
router.use('/api', db_customer_routes);
router.use('/api', db_invoice_routes);
router.use('/api', db_proposal_routes);

module.exports = router;