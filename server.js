const express = require("express");
// npm package installing handlebars for
const exphbs = require("express-handlebars");
// npm package that parses the request body
const bodyParser = require("body-parser");
// npm package that handles file paths
const path = require("path");
// npm package that helps you to navigate file system
const fs = require("fs");
// import api routes in controller folder
const apiRoutes = require(path.join(__dirname, "/Develop/controllers"));
// npm package for session middleware
const session = require("express-session");

// initiates database modesl into variable models
var db = require("./Develop/models");
var initModels = require("./Develop/models/init-models");
var models = initModels(db.sequelize);
// brings in sequelize operators
const Op = db.Sequelize.Op;

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

// expose apiRoutes to client
app.use("/api", apiRoutes);

//Expose the {reporoot}/node_modules folder to web browser clients at path http://x/node_modules
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
//Expose the {reporoot}/css folder to web browser clients at path http://x/css
app.use("/css", express.static(path.join(__dirname, "css")));
//Expose the {reporoot}/uijs folder to web browser clients at path http://x/uijs
app.use("/uijs", express.static(path.join(__dirname, "uijs")));

// //Expose the {reporoot}/uijs folder to web browser clients at path http://x/uijs
// app.use('/Develop/views', express.static(path.join(__dirname, 'views')))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
// Inform Express.js on which template engine to use
app.engine(
  "handlebars",
  exphbs.engine({
    extname: "handlebars",
    partialsDir: __dirname + "/views/partials",
  })
);

// GET request for index.html
app.get("/", function (req, res) {
  res.render("home", { data: ["test"] });
});

// / uncomment to diganose routing issues
// app._router.stack.forEach(function(r){
//   if (r.route && r.route.path){
//     console.log(r.route.path)
//   }
// });

// ****BEGIN routing
app.get("/api/customer", async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  var findOpts = {};

  if (req.query.q) {
    findOpts = {
      where: {
        [Op.or]: [
          { FirstName: { [Op.like]: req.query.q + "%" } },
          { LastName: { [Op.like]: req.query.q + "%" } }
        ],
      },
    };
  }
  // handles when id is specified in the fetch -as opposed to a sepreate get call
  if (req.query.Id) {
    findOpts = {
      where: {
        Id: req.query.Id
      },
    };
  }

  try {
    var c = await models.dbo_customers.findAll(findOpts);
    var d = c.map((v) => v.dataValues);
    // console.log(c);
    // res.render('home', {data:d});
    res.status(200).json(d);
    // res.status(200).json(c)
  } catch (err) {
    res.status(500).json(err);
  }
});

// get **AND** get by ID routes for proposals
app.get("/api/proposal", async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  var findOpts = {
    include: [
      {
        model: models.dbo_customers,
        as: "Proposal_Customer_dbo_customer",
      },
    ],
  };

  if (req.query.q) {
    findOpts.where = {
      [Op.or]: [
        {
          ["$Proposal_Customer_dbo_customer.FirstName$"]: {
            [Op.like]: `${req.query.q}%`,
          },
        },
        {
          JobName: {
            [Op.like]: `${req.query.q}%`,
          },
        },
      ],
    };
  }

  try {
    var c = await models.dbo_proposals.findAll(findOpts);
    var d = c.map((v) => v.dataValues);
    // console.log(c);
    // res.render('home', {data:d});
    res.status(200).json(d);
    // res.status(200).json(c)
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/invoice", async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  var findOpts = {
    include: [
      {
        model: models.dbo_invoicelines,
        as: "dbo_invoicelines",
      },
    ],
  };

  if (req.query.q) {
    findOpts.where = {
      [Op.or]: [
          { BillToName: { [Op.like]: req.query.q + "%" } }
        ],
      },
    };
  }
    // handles when id is specified in the fetch -as opposed to a sepreate get call
    if (req.query.Id) {
      findOpts.where = {
          Id: req.query.Id
        }
    }

  try {
    var c = await models.dbo_invoices.findAll(findOpts);
    var d = c.map((v) => v.dataValues);
    // console.log(d.dbo_invoicelines);
    // res.render('home', {data:d});
    res.status(200).json(d);
    // res.status(200).json(c)
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});


// POST route for updating custoemrs

// update a Custoemr by id
app.put('/api/customer/:id', async(req, res) => {
  try {
   var CustomerData = await models.dbo_customers.update(
      req.body,
      {
        where: {
          Id: parseInt(req.params.id)
        },
        raw:true
      }
    );
    if (CustomerData[0] == 0){
      res.status(404).json({message: "no records found to update with given id"});
      return;
    }
    res.json(CustomerData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route for updating invoice
// update a invoice by id
app.put('/api/invoice/:id', async(req, res) => {
  try {
    const invoiceData = await models.dbo_invoices.update(
      req.body,
      {
        where: {
          Id: req.params.id
        }
      }
    );

      // delete old invoicelines before adding the updated ones to prevent redundancy
    await models.dbo_invoicelines.destroy({
      where: {
        InvoiceLines_Invoice: req.params.id
      }
    });
    // loop over the items in the key InvoiceLines_Invoice key from the and create each line in dbo_invoicelines
    // 
    req.body.dbo_invoicelines.forEach(async element => {
      element.InvoiceLines_Invoice = req.params.id
      await models.dbo_invoicelines.create(
        element
      );
    });

    if (invoiceData[0] == 0){
      res.status(404).json({message: "no records found to update with given id"});
      return;
    }
    res.json(invoiceData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT route for updating proposal
// update a proposal by id
app.put('/api/proposal/:id', async(req, res) => {
  try {
    const proposalData = await models.dbo_proposals.update(
      req.body,
      {
        where: {
          Id: parseInt(req.params.id)
        }
      }
    );
    if (proposalData[0] == 0){
      res.status(404).json({message: "no records found to update with given id"});
      return;
    }
    res.json(proposalData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route for updating customer
// update a customer by id
app.post('/api/customer/', async(req, res) => {
  try {
    req.body.DateCreated = Date.now()
    const customerData = await models.dbo_customers.create(
      req.body,
      {fields:Object.keys(req.body)}
    );
    if (customerData[0] == 0){
      res.status(404).json({message: "no records found to update with given id"});
      return;
    }
    res.json(customerData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route for updating proposal
// update a proposal by id
app.post('/api/proposal/', async(req, res) => {
  try {
    req.body.DateCreated = Date.now();
    const proposalData = await models.dbo_proposals.create(
      req.body,
      {fields:Object.keys(req.body)}
    );
    if (proposalData[0] == 0){
      res.status(404).json({message: "no records found to update with given id"});
      return;
    }
    res.json(proposalData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route for updating proposal
// update a proposal by id
app.post('/api/invoice/', async(req, res) => {
  try {
    // create a invoicedate out of a now instance
    req.body.InvoiceDate = Date.now();
    // create new invoice from the invoice portion of the body, define the fields from the keys in said portion
    const invoiceData = await models.dbo_invoices.create(
      req.body.invoice,
      {fields:Object.keys(req.body.invoice)}
    )

    var newInvoiceId = await db.sequelize.query("select @@identity as newInvoiceId");
    // get newly created invoice id
    // var newInvoiceId = await res.json(Id);  
    // create series of new invoice lines from the elements stored in the dbo_invoicelines
    //  key in the body using newInvoiceId as foriegn key for the invoice the invoice lines belong to
    req.body.dbo_invoicelines.forEach(async element => {
      element.InvoiceLines_Invoice = newInvoiceId[0][0].newInvoiceId;
      await models.dbo_invoicelines.create(
        element
      );
    });

    if (invoiceData[0] == 0){
      res.status(404).json({message: "no records found to update with given id"});
      return;
    }
    res.json(invoiceData);
  } catch (err) {
    res.status(500).json(err);
  }
});


//  **** END ROUTING
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);