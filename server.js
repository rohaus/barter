var app = require('./app');
var mongoose = require('mongoose');

require('http').createServer(app).listen(app.get('port'), function () {
  console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});

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
