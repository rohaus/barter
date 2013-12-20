var mongoose = require('mongoose');
var conversationSchema = require('./conversation').conversationSchema;

// Post schema has conversation schema as a subdocument
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

var Post = mongoose.model('Post', postSchema);

module.exports = {
  Post: Post,
  postSchema: postSchema
};
