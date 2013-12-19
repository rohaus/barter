var Post = require('../models/post').Post,
    Conversation = require('../models/conversation').Conversation,
    Message = require('../models/message').Message;

var handleError = function(statusCode){
  console.log(err);
  res.send(statusCode);
};

var acceptBarter = function(req, res, next){
  Post.update({'conversations._id': req.params.id}, {$set: {'completed': true}}, function(err){
    if (err) { handleError(500); }
    Post.findOne({'conversations._id': req.params.id}, function(err, post){
      if (err) { handleError(500); }
      for(var i = 0; i < post.conversations.length; i++){
        var conversation = post.conversations[i];
        if(conversation._id.equals(req.params.id)){
          post.conversations[i].accepted = true;
          break;
        }
      }
      post.save(function(err){
        if (err) { handleError(500); }
        res.send(204);
      });
    });
  });
};

var rejectBarter = function(req, res, next){
  Post.findOne({'conversations._id': req.params.id}, function(err, post){
    if (err) { handleError(500); }
    for(var i = 0; i < post.conversations.length; i++){
      var conversation = post.conversations[i];
      if(conversation._id.equals(req.params.id)){
        post.conversations[i].accepted = false;
        break;
      }
    }
    post.save(function(err){
      if (err) { handleError(500); }
      res.send(204);
    });
  });
};

module.exports = {
  acceptBarter: acceptBarter,
  rejectBarter: rejectBarter
};
