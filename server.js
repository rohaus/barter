var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    mongoose = require('mongoose');

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
  res.send(201);
});

//Start server
app.listen(9000);

// require('http').createServer(app).listen(app.get('port'), function () {
//   console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
// });

// Database connection
mongoose.connect('mongodb://localhost/barter');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('it worked!');
  var postSchema = mongoose.Schema({
    'username' : String,
    'password' : String,
    'messages' : [{
      'message' : String,
      'image' : String
    }]
  });
  var Post = mongoose.model('Post', postSchema);
  var rohaus = new Post({
    'username': 'rohaus',
    'password': 'password',
    'messages': [{
      'message': 'This is my post',
      'image': 'something here'
    }]
  });
  rohaus.save(function(err, rohaus){
    console.log('rohaus is',rohaus);
    if(err){
      console.log('error is:', err);
    }
  });
});