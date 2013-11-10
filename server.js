var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    db = require('./database'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    keys = require('./keys');

// Config
var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({ secret: keys.secret }));
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(passport.initialize());
app.use(passport.session());

// MongoSchema
var messageSchema = new mongoose.Schema({
    'message': String,
    'from': String,
    'sentAt': { 'type': Date, 'default': Date.now }
});

var conversationSchema = new mongoose.Schema({
  'requestingUser': { 'fbId': Number, 'name': String },
  'accepted': { 'type': Boolean, 'default': false },
  'createdAt': { 'type': Date, 'default': Date.now },
  'messages': [messageSchema]
});

var postSchema = new mongoose.Schema({
  'fbId': String,
  'name': String,
  'itemName': String,
  'description': String,
  'condition': String,
  'completed': { 'type': Boolean, 'default': false },
  'loc': {
    'type': {'type': String},
    'coordinates':[]
  },
  'createdAt': { 'type': Date, 'default': Date.now },
  'image': String,
  'conversations': [conversationSchema]
});

var facebookUserSchema = new mongoose.Schema({
  'fbId': String,
  'name': String
});

var Post = mongoose.model('Post', postSchema);
var Conversation = mongoose.model('Conversation', conversationSchema);
var FbUsers = mongoose.model('fbs', facebookUserSchema);
var Message = mongoose.model('Message', messageSchema);

var auth = function (req, res, next){
  if (!req.isAuthenticated()){
    res.send(401);
  }else{
    next();
  }
};

// Authentication Strategy
passport.use(new FacebookStrategy({
    clientID: keys.clientID,
    clientSecret: keys.clientSecret,
    callbackURL: "http://localhost:9000/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, done){
    FbUsers.findOne({fbId : profile.id}, function (err, oldUser){
      if(oldUser){
        done(null,oldUser);
      }else{
        var newUser = new FbUsers({
          fbId : profile.id ,
          // email : profile.emails[0].value,
          name : profile.displayName
        }).save(function (err,newUser){
          if(err) throw err;
          done(null, newUser);
        });
      }
    });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

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
  var response = Post.find({}, function(err, posts){
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
    'loc': { type: 'Point', coordinates: [req.body.location[0], req.body.location[1]]},
    'image': req.body.image.dataURL
  });

  post.save(function (err, post){
    if(err){
      console.log('error is:', err);
    }
  });
  res.send(201);
});

app.post('/sendNewConversation', auth, function (req, res, next){
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
    if(err){
      console.log(err);
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
  Post.update({'conversations._id': req.body._id}, {$set: {'completed': true}}, function(err){
    if(err){
      console.log(err);
      res.send(500);
    }
    res.send(201);
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

//Start server
app.listen(9000);
