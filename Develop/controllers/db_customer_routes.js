const router = require('express').Router();
var db = require('../models');
var initModels = require("../models/init-models");
var models = initModels(db.sequelize);

router.get('/customer', async (req, res) => {
    // Send the rendered Handlebars.js template back as the response
    var c = await models.dbo_customers.findAll();

    res.status(200).json(c)
  });
  
module.exports = router;