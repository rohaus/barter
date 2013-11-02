var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    db = require('./database');

var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// Sets the public directory as static
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
// Routes
app.get('/', function (req, res, next) {
  res.render('index');
});

app.post('/post', function (req, res, next) {
  console.log("It made it to the server!");
  var postSchema = mongoose.Schema({
    'username' : String,
    'password' : String,
    'messages' : [{
      'description' : String,
      'image' : String
    }]
  });
  var Post = mongoose.model('Post', postSchema);
  var post = new Post({
    'username': 'rohaus',
    'value': req.body.value,
    'messages': [{
      'description': req.body.description,
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
