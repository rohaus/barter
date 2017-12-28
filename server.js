var db = require('./config/database'),
        passport = require('passport'),
        FacebookStrategy = require('passport-facebook').Strategy,
        FbUsers = require('./app/models/facebook').FbUsers,
        app = require('./config/config')(passport);

require('./config/passport')(passport, FacebookStrategy, FbUsers);
require('./config/routes')(app, passport, db);

//const  fb = require('./app/models').facebook;
//FbUsers.create(
//        {
//            fbId: "test111",
//            name: "test1ss"
//        }
//);

