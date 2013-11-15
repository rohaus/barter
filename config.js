module.exports = function(passport){
  var express = require('express'),
  path = require('path'),
  hbs = require('hbs'),
  stylus = require('stylus'),
  keys = require('./keys');

  var compile = function(str, path) {
    return stylus(str)
      .set('filename', path);
  };

  // Config
  var app = express();
  var port = process.env.PORT || 9000;
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser());
  app.use(express.session({ secret: keys.secret }));
  app.use(express.bodyParser());
  app.use(express.logger('dev'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.listen(port, function() {
    console.log('Listening on ' + port);
  });
  return app;
};
