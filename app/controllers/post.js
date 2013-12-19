var Post = require('../models/post').Post,
    Conversation = require('../models/conversation').Conversation,
    Message = require('../models/message').Message;

var handleError = function(statusCode){
  console.log(err);
  res.send(statusCode);
};

var posts = function(req, res, next){
  Post.find({}, function(err, posts){
    if (err) { handleError(500); }
    res.send(200, posts);
  });
};

var postItem = function(req, res, next){
  var post = new Post({
    'fbId': req.body.fbId,
    'name': req.body.name,
    'itemName': req.body.itemName,
    'description': req.body.description,
    'condition': req.body.condition,
    'loc': { type: 'Point', coordinates: [req.body.location[1], req.body.location[0]]},
    'image': req.body.image.dataURL
  });

  post.save(function (err, post){
    if (err) { handleError(500); }
    res.send(201);
  });
};

var deletePost = function(req, res, next){
  Post.findByIdAndRemove(req.body._id, function(err){
    if (err) { handleError(500); }
    res.send(204);
  });
};

module.exports = {
  posts: posts,
  post: postItem,
  deletePost: deletePost
};
