var conversationSchema = require('./conversation'),
mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  'fbId': String,
  'name': String,
  'itemName': String,
  'description': String,
  'condition': String,
  'completed': { 'type': Boolean, 'default': false },
  'loc': {
    'type': {'type': String, index: true },
    'coordinates':[]
  },
  'createdAt': { 'type': Date, 'default': Date.now },
  'image': String,
  'conversations': [conversationSchema]
});

module.exports = mongoose.model('Post', postSchema);
