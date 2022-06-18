const router = require('express').Router();
const { Cusomters } = require('../models');


router.get('/customer', async (req, res) => {
    // Send the rendered Handlebars.js template back as the response
    res.status(200).json("success")
  });
  
module.exports = router;