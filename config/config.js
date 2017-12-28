module.exports = function(passport){
	process.env.NODE_ENV = 'development';
  var express = require('express'),
      path = require('path'),
      stylus = require('stylus'),
      env = process.env['NODE_ENV'] || 'development',
      keys;
  // Set environment
  keys = (env === 'production') ? require('./productionKeys')[env] : require('./keys')[env];

  // Middleware used to compile stylus
  var compile = function(str, path) {
    return stylus(str).set('filename', path);
  };

  // Config
  var app = express();
  var port = process.env.PORT || 9000;
  app.set('views', __dirname + '/../app/views');
  app.set('view engine', 'jade');
  app.use(stylus.middleware({ src: __dirname + '/../public', compile: compile }));
  app.use(express.static(path.join(__dirname, '/../public')));
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
