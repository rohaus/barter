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
  'description' : String,
  'value': String,
  'loc': {
    type: {type: String},
    coordinates:[]
  },
  'image' : String
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
