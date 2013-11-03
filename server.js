var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    db = require('./database');

var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);

var postSchema = mongoose.Schema({
  'username' : String,
  'messages' : [{
    'description' : String,
    'value': String,
    'geo': {lat: Number, lng: Number},
    'image' : String
  }]
});

// Sets the public directory as static
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
// Routes
app.get('/', function (req, res, next) {
  res.render('index');
});

app.get('/items', function (req, res, next){
  var Post = mongoose.model('Post', postSchema);
  var response = Post.find({}, function(err, posts){
    console.log("Posts are found!");
    res.send(201, posts);
  });
});

app.post('/post', function (req, res, next) {
  console.log("It made it to the server!");
  console.log({
    'username': 'rohaus',
    'messages': [{
      'description': req.body.description,
      'value': req.body.value,
      'geo': {lat: req.body.location.lat, lng: req.body.location.lng},
      'image': req.body.image.dataURL
    }]
  });
  // TODO: Change geolocation to use mongo indexing
  var Post = mongoose.model('Post', postSchema);
  var post = new Post({
    'username': 'rohaus',
    'messages': [{
      'description': req.body.description,
      'value': req.body.value,
      'geo': {lat: req.body.location.lat, lng: req.body.location.lng},
      'image': req.body.image.dataURL
    }]
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
