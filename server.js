const express = require('express');
// npm package that parses the request body
const bodyParser = require('body-parser');
// npm package that handles file paths
const path = require('path');
const fs = require('fs');


const PORT = process.env.PORT || 3001;
// npm package that generates a unique id
var uniqid = require('uniqid'); 

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// GET request for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
