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
var postSchema = new mongoose.Schema({
  'fbId': String,
  'name': String,
  'description' : String,
  'value': String,
  'loc': {
    'type': {'type': String},
    'coordinates':[]
  },
  'image' : String
});

var messageSchema = new mongoose.Schema({
  'participants': [{
    'fbId': Number,
    'name': String
  }],
  'topic': String,
  'messages': [{
    'message': String,
    'from': String,
    'date': { 'type': Date, 'default': Date.now }
  }]
});

var facebookUserSchema = new mongoose.Schema({
  'fbId': String,
  // 'email': { 'type' : String , 'lowercase' : true},
  'name': String
});

var Post = mongoose.model('Post', postSchema);
var Message = mongoose.model('Message', messageSchema);
var FbUsers = mongoose.model('fbs', facebookUserSchema);

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
  res.redirect('index');
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

app.post('/post', auth, function (req, res, next){
  var post = new Post({
    'fbId': req.body.fbId,
    'name': req.body.name,
    // 'email': req.body.email,
    'description': req.body.description,
    'value': req.body.value,
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

app.post('/sendNewMessage', function (req, res, next){
  console.log("req.body.participants is", req.body.participants);
  var message = new Message({
    'participants': [{
      'fbId': req.body.participants[0].fbId,
      'name': req.body.participants[0].name
    },{
      'fbId': req.body.participants[1].fbId,
      'name': req.body.participants[1].name
    }],
    'topic': req.body.topic,
    'messages': [{
      'message': req.body.message,
      'from': req.body.from
    }]
  });
  message.save(function (err, post){
    if(err){
      console.log('error is:', err);
    }
  });
  res.send(201);
});
//Start server
app.listen(9000);
