const express = require('express');
// npm package installing handlebars for 
const exphbs = require('express-handlebars');
// npm package that parses the request body
const bodyParser = require('body-parser');
// npm package that handles file paths
const path = require('path');
// npm package that helps you to navigate file system
const fs = require('fs');
// import api routes in controller folder
const apiRoutes = require(path.join(__dirname, '/Develop/controllers'));
// npm package for session middleware
const session = require('express-session');








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
//Expose the {reporoot}/uijs folder to web browser clients at path http://x/uijs
app.use('/uijs', express.static(path.join(__dirname, 'uijs')))


// //Expose the {reporoot}/uijs folder to web browser clients at path http://x/uijs
// app.use('/Develop/views', express.static(path.join(__dirname, 'views')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
// Inform Express.js on which template engine to use
app.engine('handlebars', exphbs.engine({
  extname: 'handlebars',
  partialsDir: __dirname + '/views/partials'
}));

// GET request for index.html
app.get('/', function (req, res) {
  

  res.render('home', {data:["test"]});
});
// Allow web browser access to node modules folder
// app.get('/node_modules', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });



app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
