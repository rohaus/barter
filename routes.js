module.exports = function(app, passport, db){
  var Post = require('./database/schema/post').Post,
  Conversation = require('./database/schema/conversation').Conversation,
  Message = require('./database/schema/message').Message;

  var auth = function (req, res, next){
    if (!req.isAuthenticated()){
      res.send(401);
    }else{
      next();
    }
  };

  // Login Routes
  app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.post('/logout', function (req, res){
    req.logOut();
    res.redirect('/');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

  // Routes
  app.get('/', function (req, res, next) {
    res.render('index');
  });

  app.get('/items', auth, function (req, res, next){
    // var coords = req.params.coords.split(",");
    // var geojsonPoly = {
    //   type: 'Polygon',
    //   coordinates:
    //     [[[coords[1], coords[0]],
    //      [coords[1], coords[2]],
    //      [coords[3], coords[2]],
    //      [coords[3], coords[0]]]]
    //    };
    // var options = { near: [-122.4167, 37.7837749], maxDistance: 500000 };
    // Post.geoSearch({ type : "Point" }, options, function(err, posts){
    Post.find({}, function(err, posts){
      if(err){
        console.log(err);
        res.send(500);
      }
      res.send(201, posts);
    });
  });

  app.get('/messages', auth, function (req, res, next){
    Post.find({}, function(err, messages){
      res.send(201, messages);
    });
  });

  app.post('/post', auth, function (req, res, next){
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
      if(err){
        console.log('error is:', err);
        res.send(500);
      }
    });
    res.send(201);
  });

  app.post('/sendNewConversation', auth, function (req, res, next){
    console.log("req is:",req.user);
    var message = new Message({
      'message': req.body.message,
      'from': req.body.from
    });
    console.log("message is:", message);
    var conversation = new Conversation({
      'requestingUser': {
        'fbId': req.body.requestingUser.fbId,
        'name': req.body.requestingUser.name
      },
      'messages': [message]
    });
    console.log("conversation is:", conversation);
    Post.update({'_id': req.body._id}, {$push: {'conversations': conversation}}, function(err){
      if(err){
        console.log(err);
        res.send(500);
      }
      res.send(201);
    });
  });

  app.post('/sendMessage', auth, function (req, res, next){
    var message = new Message({
      'message': req.body.message,
      'from': req.body.from
    });
    Post.findOne({'conversations._id': req.body._id}, function(err, post){
      if(err){
        console.log(err);
        res.send(500);
      }
      for(var i = 0; i < post.conversations.length; i++){
        var conversation = post.conversations[i];
        if(conversation._id.equals(req.body._id)){
          post.conversations[i].messages.push(message);
          break;
        }
      }
      post.save(function(err){
        if(err){
          console.log(err);
          res.send(500);
        }
        res.send(201);
      });
    });
  });

  // app.post('/deleteMessage', auth, function (req, res, next){
  //   Conversation.messages.id(req.body._id);
  //   res.send(201);
  // });

  app.post('/deleteConversation', auth, function (req, res, next){
    Post.findOne({"conversations._id": req.body._id}, function(err, post){
      var conversation = post.conversations.id(req.body._id).remove();
      post.save(function (err) {
        if(err){
          console.log(err);
          res.send(500);
        }
        console.log('the sub-doc was removed');
        res.send(201);
      });
    });
    // Post.findOneAndRemove({'conversations._id': req.body._id}, function(err){
    //   if (err){
    //     console.log(err);
    //   }
    //   console.log("Conversation was deleted!");
    //   res.send(201);
    // });
  });

  app.post('/acceptBarter', auth, function (req, res, next){
    Post.update({'conversations._id': req.body._id}, {$set: {'completed': true}}, function(err){
      if(err){
        console.log(err);
        res.send(500);
      }
      Post.findOne({'conversations._id': req.body._id}, function(err, post){
        if(err){
          console.log(err);
          res.send(500);
        }
        for(var i = 0; i < post.conversations.length; i++){
          var conversation = post.conversations[i];
          if(conversation._id.equals(req.body._id)){
            post.conversations[i].accepted = true;
            break;
          }
        }
        post.save(function(){
          res.send(201);
        });
      });
    });
  });

  app.post('/rejectBarter', auth, function (req, res, next){
    Post.findOne({'conversations._id': req.body._id}, function(err, post){
      if(err){
        console.log(err);
        res.send(500);
      }
      for(var i = 0; i < post.conversations.length; i++){
        var conversation = post.conversations[i];
        if(conversation._id.equals(req.body._id)){
          post.conversations[i].accepted = false;
          break;
        }
      }
      post.save(function(){
        res.send(201);
      });
    });
  });

  app.post('/deletePost', auth, function (req, res, next){
    Post.findByIdAndRemove(req.body._id, function(err){
      if(err){
        console.log(err);
        res.send(500);
      }
      res.send(201);
    });
  });
};
