var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    db = require('./database/database.js'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    keys = require('./keys'),
    FbUsers = require('./database/schema/facebook').FbUsers;

// Config
var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({ secret: keys.secret }));
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(passport.initialize());
app.use(passport.session());



require('./passport')(passport, FacebookStrategy, FbUsers);
require('./routes')(app, passport, db);
//Start server
app.listen(9000);
