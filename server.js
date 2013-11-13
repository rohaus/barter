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

// Authentication Strategy
passport.use(new FacebookStrategy({
    clientID: keys.clientID,
    clientSecret: keys.clientSecret,
    callbackURL: "http://localhost:9000/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, done){
    FbUsers.findOne({fbId : profile.id}, function (err, oldUser){
      if(oldUser){
        done(null,oldUser);
      }else{
        var newUser = new FbUsers({
          fbId : profile.id ,
          // email : profile.emails[0].value,
          name : profile.displayName
        }).save(function (err,newUser){
          if(err) throw err;
          done(null, newUser);
        });
      }
    });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

require('./routes')(app, passport, db);
//Start server
app.listen(9000);
