process.env['NODE_ENV'] = 'test';

var request = require('superagent'),
    should = require('should'),
    db = require('../database/database'),
    passport = require('passport'),
    app = require('../config')(passport);
    FacebookStrategy = require('passport-facebook').Strategy,
    FbUsers = require('../database/schema/facebook').FbUsers,
    Post = require('../database/schema/post').Post,
    Conversation = require('../database/schema/conversation').Conversation,
    Message = require('../database/schema/message').Message;

describe('Tests', function(){
  var post1 = {
    'fbId': '1234',
    'name': 'Ryan',
    'itemName': 'Chair',
    'description': 'It is a very hip chair',
    'condition': 'Fair',
    'loc': { type: 'Point', coordinates: [37.3837749,-122.4067]},
    'image': 'http://i.c-b.co/is/image/Crate/PetrieChairCamdenGrpht3QF10/$web_zoom$&/1308302307/petrie-chair.jpg'
  };
  var post2 = {
    'fbId': '1235',
    'name': 'Jeorge',
    'itemName': 'Table',
    'description': 'It is a table that does not quit',
    'condition': 'Fair',
    'loc': { type: 'Point', coordinates: [37.3837749,-122.4067]},
    'image': 'http://www.digsdigs.com/photos/Cool-Kids-Table-Chalkboard-Table-by-Eric-Pfeiffer-1.jpg'
  };
  var post3 = {
    'fbId': '1234',
    'name': 'Ryan',
    'itemName': 'Hat',
    'description': 'A hat for a fancy man',
    'condition': 'Fair',
    'loc': { type: 'Point', coordinates: [37.3837749,-122.4067]},
    'image': 'http://theblogofchoice.com/wp-content/uploads/2013/09/58121.jpg'
  };
  var message1 = {
    'message': 'Yo I want this',
    'from': 'Ryan'
  };
  var message2 = {
    'message': 'What do you have?',
    'from': 'Jeorge'
  };
  var message3 = {
    'message': 'Want a fancy hat?',
    'from': 'Ryan'
  };
  var conversation1 = {
    'requestingUser': { 'fbId': '1234', 'name': 'Ryan' },
    'messages': [message1]
  };
  var conversation2 = {
    'requestingUser': { 'fbId': '1234', 'name': 'Jeorge' },
    'messages': [message2]
  };
  var conversation3 = {
    'requestingUser': { 'fbId': '1234', 'name': 'Ryan' },
    'messages': [message3]
  };

  // Post.find({}).remove();
  var agent = request.agent();

  describe('Post Controls for invalid users', function(){
    describe('/post route', function(){
      it('should not post an item in the database', function(done){
        agent.post('http://barter-app.herokuapp.com/post')
        .send(post1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });

    describe('/items route', function(){
      it('should not retrieve items in the database', function(done){
        agent.get('http://barter-app.herokuapp.com/items')
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });

    describe('/deletePost route', function(){
      it('should not delete a post in the database', function(done){
        agent.post('http://barter-app.herokuapp.com/post')
        .send(post1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });
  });

  describe('Message Controls for invalid users', function(){
    describe('/sendNewConversation route', function(){
      it('should not append a conversation in an existing post', function(done){
        agent.post('http://barter-app.herokuapp.com/sendNewConversation')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });

      it('should not append a conversation in the correct post when multiple posts exists', function(done){
        agent.post('http://barter-app.herokuapp.com/sendNewConversation')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });

      it('should not append multiple conversations the correct post when multiple posts exists', function(done){
        agent.post('http://barter-app.herokuapp.com/sendNewConversation')
        .send(conversation1)
        .send(conversation2)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });

    describe('/sendMessage route', function(){
      it('should not append a message in the correct conversation', function(done){
        agent.post('http://barter-app.herokuapp.com/sendMessage')
        .send(message1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });

      it('should not append two messages in the correct conversation', function(done){
        agent.post('http://barter-app.herokuapp.com/sendMessage')
        .send(message1)
        .send(message2)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });

      it('should not append multiple messages from both users in the conversation', function(done){
        agent.post('http://barter-app.herokuapp.com/sendMessage')
        .send(message3)
        .send(message2)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });

    describe('/deleteConversation route', function(){
      it('should not delete a conversation', function(done){
        agent.post('http://barter-app.herokuapp.com/deleteConversation')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });

      it('should not delete a conversation when multiple exist', function(done){
        agent.post('http://barter-app.herokuapp.com/deleteConversation')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });
  });

  describe('Barter Request Controls for invalid users', function(){
    describe('/acceptBarter route', function(){
      it('should not allow you to accept your own barter posting', function(done){
        agent.post('http://barter-app.herokuapp.com/acceptBarter')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });

      it('should not accept a barter request from someone else', function(done){
        agent.post('http://barter-app.herokuapp.com/acceptBarter')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });

    describe('/rejectBarter route', function(){
      it('should not allow you to reject your own barter posting', function(done){
        agent.post('http://barter-app.herokuapp.com/rejectBarter')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });

      it('should not reject a barter request from someone else', function(done){
        agent.post('http://barter-app.herokuapp.com/rejectBarter')
        .send(conversation1)
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(401);
          done();
        });
      });
    });
  });

  after(function(done){
    Post.find({}).remove();
    done();
  });
});
