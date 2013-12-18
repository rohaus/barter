// Database connection
var mongoose = require('mongoose'),
    keys;

var env = process.env['NODE_ENV'] || 'development';

if(env === 'production'){
  keys = require('./productionKeys')[env];
}else{
  keys = require('./keys')[env];
}

mongoose.connect(keys.DB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Database connected!');
});

module.exports = db;
