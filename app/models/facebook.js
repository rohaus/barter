var mongoose = require('mongoose');
var facebookUserSchema = new mongoose.Schema({
  'fbId': String,
  'name': String
});
var FbUsers = mongoose.model('fbs', facebookUserSchema);

module.exports = {
  FbUsers: FbUsers,
  facebookUserSchema: facebookUserSchema
};
