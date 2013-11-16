var Post = require('../database/schema/post').Post,
    Conversation = require('../database/schema/conversation').Conversation,
    Message = require('../database/schema/message').Message;

var handleError = function(statusCode){
  console.log(err);
  res.send(statusCode);
};

var messages = function (req, res, next){
  Post.find({}, function(err, messages){
    if (err) { handleError(500); }
    res.send(200, messages);
  });
};

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
    if (err) { handleError(500); }
    res.send(201);
  });
};

var sendMessage = function(req, res, next){
  var message = new Message({
    'message': req.body.message,
    'from': req.body.from
  });
  Post.findOne({'conversations._id': req.body._id}, function(err, post){
    if (err) { handleError(500); }
    for(var i = 0; i < post.conversations.length; i++){
      var conversation = post.conversations[i];
      if(conversation._id.equals(req.body._id)){
        post.conversations[i].messages.push(message);
        break;
      }
    }
    post.save(function(err){
      if (err) { handleError(500); }
      res.send(201);
    });
  });
};

// var deleteMessage = function(req, res, next){
//   Conversation.messages.id(req.body._id);
//   res.send(201);
// };

var deleteConversation = function(req, res, next){
  Post.findOne({"conversations._id": req.body._id}, function(err, post){
    if (err) { handleError(500); }
    var conversation = post.conversations.id(req.body._id).remove();
    post.save(function (err) {
      if (err) { handleError(500); }
      console.log('the sub-doc was removed');
      res.send(204);
    });
  });
};

module.exports = {
  messages: messages,
  sendNewConversation: sendNewConversation,
  sendMessage: sendMessage,
  // deleteMessage: deleteMessage,
  deleteConversation: deleteConversation
};
