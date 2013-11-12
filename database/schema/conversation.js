var messageSchema = require('./message'),
mongoose = require('mongoose');

var conversationSchema = new mongoose.Schema({
  'requestingUser': { 'fbId': Number, 'name': String },
  'accepted': { 'type': Boolean, 'default': null },
  'createdAt': { 'type': Date, 'default': Date.now },
  'messages': [messageSchema]
});

module.exports = mongoose.model('Conversation', conversationSchema);
