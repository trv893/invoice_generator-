const router = require('express').Router();
var db = require('../models');
var initModels = require("../models/init-models");
var models = initModels(db.sequelize);

router.get('/customer', async (req, res) => {
    // Send the rendered Handlebars.js template back as the response
    try {
    var c = await models.dbo_customers.findAll();

    console.log(c);
    customerlist = c
    // res.render('home', {data:c.FirstName});

    // res.status(200).json(c)
    }
   catch (err) {
    res.status(400).json(err);
  }
  });
  
module.exports = router;