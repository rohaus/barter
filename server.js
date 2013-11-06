var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    db = require('./database'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var postSchema = mongoose.Schema({
  'username' : String,
  'description' : String,
  'value': String,
  'loc': {
    type: {type: String},
    coordinates:[]
  },
  'image' : String
});

// Config
var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// Sets the public directory as static
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());


var auth = function(req, res, next){
  console.log("checking authorization");
  if (!req.isAuthenticated()){
    res.send(401);
  }else{
    next();
  }
};

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === "admin" && password === "admin") // stupid example
      return done(null, {name: "admin"});

    return done(null, false, { message: 'Incorrect username.' });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://www.example.com/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, done){
//     User.findOrCreate(..., function(err, user){
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   }
// ));

// Login Routes

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  console.log("get to /loggedin req.isAuthenticated is:", req.isAuthenticated());
  console.log("req.user is:",req.user);
  req.isAuthenticated() ? console.log("req.user is authenticated!",req.user) : console.log("req.user is not authenticated. it is sending",0);
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in

app.post('/login', passport.authenticate('local'), function(req, res){
  console.log("post request to /login:", passport.authenticate('local'));
  console.log("req.user is:",req.user);
  res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res){
  console.log('post request made to /logout');
  req.logOut();
  res.send(200);
});


// Routes
app.get('/', function(req, res, next) {
  console.log("get request made to /");
  res.render('index');
});

app.get('/items', function(req, res, next){
  console.log("get request made to /items");
  var Post = mongoose.model('Post', postSchema);
  var response = Post.find({}, function(err, posts){
    console.log("Posts are found!");
    res.send(201, posts);
  });
});

app.get('/users', function(req, res){
  console.log("get request made to /user");
  res.send([{name: "user1"}, {name: "user2"}]);
});

app.post('/post', function (req, res, next) {
  console.log('post request made to /post');
  console.log("It made it to the server!");

  // TODO: Use user authentication
  var Post = mongoose.model('Post', postSchema);
  var post = new Post({
    'username': 'rohaus',
    'description': req.body.description,
    'value': req.body.value,
    'loc': { type: 'Point', coordinates: [req.body.location[0], req.body.location[1]]},
    'image': req.body.image.dataURL
  });

  post.save(function(err, post){
    console.log('the post is',post);
    if(err){
      console.log('error is:', err);
    }
  });
  res.send(201);
});

//Start server
app.listen(9000);
