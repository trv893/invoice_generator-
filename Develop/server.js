
const { DataTypes } = require("sequelize");
// console.log(sequelize.DataTypes);

var sequelize = require('./config/connection');

var dbo_customers = require("./models/dbo_customers")
var epilogue = require('epilogue');
var http = require('http');
// Define your models
var database = sequelize;
const writeFile = require('write-file');
// var database = new Sequelize('database', 'root', 'password');
// var User = database.define('User', {
//   username: Sequelize.STRING,
//   birthday: Sequelize.DATE
// });

// Initialize server
var server, app;
if (process.env.USE_RESTIFY) {
  var restify = require('restify');

  app = server = restify.createServer()
  app.use(restify.queryParser());
  app.use(restify.bodyParser());
} else {
  var express = require('express'),
      bodyParser = require('body-parser');

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  server = http.createServer(app);
}

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
});
console.log(dbo_customers);
// Create REST resource
var userResource = epilogue.resource({
  model: dbo_customers(database, DataTypes),
  endpoints: ['/customer', '/customer/:id']
});

// Create database and listen
database
  .sync({ force: false })
  .then(function() {
    server.listen(function() {
      var host = server.address().address,
          port = server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });
  });

// console.log(userResource);

// writeFile('./routes/api/customer', userResource, function (err) {
// 	if (err) return console.log(err)
// 	console.log('file is written')
//   })