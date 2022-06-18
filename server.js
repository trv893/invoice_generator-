const express = require('express');
// npm package that parses the request body
const bodyParser = require('body-parser');
// npm package that handles file paths
const path = require('path');
const fs = require('fs');
// import api routes in controller folder
const apiRoutes = require(path.join(__dirname, '/Develop/controllers'));





const PORT = process.env.PORT || 3001;
// npm package that generates a unique id
var uniqid = require('uniqid'); 

const app = express();
app.use(bodyParser.json());

// expose apiRoutes to client
app.use("/", apiRoutes);

//Expose the {reporoot}/node_modules folder to web browser clients at path http://x/node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
//Expose the {reporoot}/css folder to web browser clients at path http://x/css
app.use('/css', express.static(path.join(__dirname, 'css')))

// GET request for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Allow web browser access to node modules folder
app.get('/node_modules', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
