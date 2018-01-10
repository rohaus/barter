var Post = require('../models/post').Post,
        Conversation = require('../models/conversation').Conversation,
        Message = require('../models/message').Message,
        utils = require('../utils'),
        _ = require('lodash');
// Send back all posts
var posts = function (req, res, next) {
    Post.find({}, function (err, posts) {
        utils.handleError(err, 500);
        res.send(200, posts);
    });
};

// Create post and save it to the database
var postItem = function (req, res, next) {
    var post = new Post({
        'fbId': req.body.fbId,
        'name': req.body.name,
        'itemName': req.body.itemName,
        'description': req.body.description,
        'condition': req.body.condition,
        'loc': {type: 'Point', coordinates: [req.body.location[1], req.body.location[0]]},
        'image': req.body.image.dataURL
    });
    utils.saveChanges(res, post, 201, 500);
};

// Delete post from the database
var deletePost = function (req, res, next) {
    Post.findByIdAndRemove(req.params.id, function (err) {
        utils.handleError(err, 500);
        res.send(204);
    });
};



// Update post and save it to the database
var updatePost = function (req, res, next) {

    var post = {
        'fbId': req.body.fbId,
        'name': req.body.name,
        'itemName': req.body.itemName,
        'description': req.body.description,
        'condition': req.body.condition,
        'loc': {type: 'Point', coordinates: [req.body.location[1], req.body.location[0]]},
    }
    if (req.body.image.dataURL) {
        post.image = req.body.image.dataURL;
    }
    Post.findOneAndUpdate({_id: req.body.post_id}, post, {new : true}, function (err, doc) {
        utils.handleError(err, 500);
        return res.send("succesfully updated");
    });
};
module.exports = {
    posts: posts,
    post: postItem,
    deletePost: deletePost,
    updatePost: updatePost
};
