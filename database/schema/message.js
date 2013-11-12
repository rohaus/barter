var mongoose = require('mongoose');
var messageSchema = new mongoose.Schema({
  'message': String,
  'from': String,
  'sentAt': { 'type': Date, 'default': Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
