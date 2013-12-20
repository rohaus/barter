var Post = require('../models/post').Post,
    Conversation = require('../models/conversation').Conversation,
    Message = require('../models/message').Message,
    utils = require('../utils'),
    _ = require('lodash');

//  Function to find and update conversation
var changeBarterStatus = function(req, post, status){
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
  utils.handleError(err, 500);
  Post.findOne({'conversations._id': req.params.id}, function(err, post){
    utils.handleError(err, 500);
    changeBarterStatus(req, post, status);
    utils.saveChanges(res, post, 204, 500);
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
