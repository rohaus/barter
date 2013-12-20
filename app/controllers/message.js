var Post = require('../models/post').Post,
    Conversation = require('../models/conversation').Conversation,
    Message = require('../models/message').Message,
    utils = require('../utils'),
    _ = require('lodash');

// Function to add message to conversation
var addMessageToConversation = function(req, post, message){
  _.each(post.conversations, function(conversation){
    if(conversation._id.equals(req.body._id)){
      conversation.messages.push(message);
      return;
    }
  });
};

// Add a new conversation to the posting
var sendNewConversation = function(req, res, next){
  var message = new Message({
    'message': req.body.message,
    'from': req.body.from
  });
  var conversation = new Conversation({
    'requestingUser': {
      'fbId': req.body.requestingUser.fbId,
      'name': req.body.requestingUser.name
    },
    'messages': [message]
  });
  Post.update({'_id': req.body._id}, {$push: {'conversations': conversation}}, function(err){
    utils.handleError(err, 500);
    res.send(201);
  });
};

// Add a new message to the conversation
var sendMessage = function(req, res, next){
  var message = new Message({
    'message': req.body.message,
    'from': req.body.from
  });
  Post.findOne({'conversations._id': req.body._id}, function(err, post){
    utils.handleError(err, 500);
    addMessageToConversation(req, post, message);
    utils.saveChanges(res, post, 201, 500);
  });
};

// Delete conversation in the posting
var deleteConversation = function(req, res, next){
  Post.findOne({'conversations._id': req.params.id}, function(err, post){
    utils.handleError(err, 500);
    post.conversations.id(req.params.id).remove();
    utils.saveChanges(res, post, 204, 500);
  });
};

module.exports = {
  sendNewConversation: sendNewConversation,
  sendMessage: sendMessage,
  deleteConversation: deleteConversation
};
