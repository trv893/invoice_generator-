var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(3000);