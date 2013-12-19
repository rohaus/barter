var Post = require('../models/post').Post,
    Conversation = require('../models/conversation').Conversation,
    Message = require('../models/message').Message,
    _ = require('lodash');

// Utility function to handle error if there is an error
var handleError = function(err, statusCode){
  if(err){
    console.log(err);
    res.send(statusCode);
  }
};

// Utility function to update conversation
var updateConversation = function(req, post, status){
  _.each(post.conversations, function(conversation){
    if(conversation._id.equals(req.params.id)){
      conversation.accepted = status;
      return;
    }
  });
};

// General update barter trade status (accepted or rejcted)
// Find the correct barter and update the status
var updateBarter = function(req, res, err, status){
  handleError(err, 500);
  Post.findOne({'conversations._id': req.params.id}, function(err, post){
    handleError(err, 500);
    updateConversation(req, post, status);
    post.save(function(err){
      handleError(err, 500);
      res.send(204);
    });
  });
};

// Set barter request to accepted
var acceptBarter = function(req, res, next){
  Post.update({'conversations._id': req.params.id}, {$set: {'completed': true}}, function(err){
    updateBarter(req, res, err, true);
  });
};

// Set barter request to rejected
var rejectBarter = function(req, res, next){
  Post.findOne({'conversations._id': req.params.id}, function(err, post){
    updateBarter(req, res, err, false);
  });
};

module.exports = {
  acceptBarter: acceptBarter,
  rejectBarter: rejectBarter
};
