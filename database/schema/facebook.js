var mongoose = require('mongoose');
var facebookUserSchema = new mongoose.Schema({
  'fbId': String,
  'name': String
});

module.exports = mongoose.model('fbs', facebookUserSchema);
