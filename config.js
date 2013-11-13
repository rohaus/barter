module.exports = function(passport){
  var express = require('express'),
  path = require('path'),
  hbs = require('hbs'),
  keys = require('./keys');

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
  return app;
};
