var Post = require('../database/schema/post').Post,
    Conversation = require('../database/schema/conversation').Conversation,
    Message = require('../database/schema/message').Message;

var handleError = function(statusCode){
  console.log(err);
  res.send(statusCode);
};

var acceptBarter = function(req, res, next){
  Post.update({'conversations._id': req.body._id}, {$set: {'completed': true}}, function(err){
    if (err) { handleError(500); }
    Post.findOne({'conversations._id': req.body._id}, function(err, post){
      if (err) { handleError(500); }
      for(var i = 0; i < post.conversations.length; i++){
        var conversation = post.conversations[i];
        if(conversation._id.equals(req.body._id)){
          post.conversations[i].accepted = true;
          break;
        }
      }
      post.save(function(err){
        if (err) { handleError(500); }
        res.send(201);
      });
    });
  });
};

var rejectBarter = function(req, res, next){
  Post.findOne({'conversations._id': req.body._id}, function(err, post){
    if (err) { handleError(500); }
    for(var i = 0; i < post.conversations.length; i++){
      var conversation = post.conversations[i];
      if(conversation._id.equals(req.body._id)){
        post.conversations[i].accepted = false;
        break;
      }
    }
    post.save(function(err){
      if (err) { handleError(500); }
      res.send(201);
    });
  });
};

module.exports = {
  acceptBarter: acceptBarter,
  rejectBarter: rejectBarter
};
