var mongoose = require('mongoose');
var messageSchema = new mongoose.Schema({
  'message': String,
  'from': String,
  'sentAt': { 'type': Date, 'default': Date.now }
});
var Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message: Message,
  messageSchema: messageSchema
};
