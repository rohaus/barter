var mongoose = require('mongoose');

// Facebook User Schema to keep track of fbId and name
var facebookUserSchema = new mongoose.Schema({
  'fbId': String,
  'name': String
});

var FbUsers = mongoose.model('fbs', facebookUserSchema);

module.exports = {
  FbUsers: FbUsers,
  facebookUserSchema: facebookUserSchema
};
