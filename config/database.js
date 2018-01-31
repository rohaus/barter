// Database connection
var mongoose = require('mongoose'),
    env = process.env['NODE_ENV'] || 'development',
    keys, db;
// Determine if keys are based on production or development
keys = (env === 'production') ? require('./productionKeys')[env] : require('./keys')[env];
// Mongoose conncetion
mongoose.connect(keys.DB);
db = mongoose.connection;
// Notify if connection was successful
db.once('open', function(){
  console.log('Database connected!');
});

// Notify if conncetion errored
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;
