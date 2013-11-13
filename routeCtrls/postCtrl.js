var Post = require('../database/schema/post').Post,
    Conversation = require('../database/schema/conversation').Conversation,
    Message = require('../database/schema/message').Message;

var handleError = function(statusCode){
  console.log(err);
  res.send(statusCode);
};

var items = function(req, res, next){
  Post.find({}, function(err, posts){
    if (err) { handleError(500); }
    res.send(201, posts);
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
    res.send(201);
  });
};

module.exports = {
  items: items,
  post: postItem,
  deletePost: deletePost
};
