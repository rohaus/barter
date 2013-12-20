var mongoose = require('mongoose');

// Message Schema for messages in a conversation
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
