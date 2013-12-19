module.exports = function(app, passport, db){
  var loginCtrl = require('../app/controllers/login'),
  barterCtrl = require('../app/controllers/barter'),
  postCtrl = require('../app/controllers/post'),
  messageCtrl = require('../app/controllers/message');

  var auth = function (req, res, next){
    !req.isAuthenticated() ? res.send(401) : next();
  };

  // Login Routes
  app.get('/', loginCtrl.index);
  app.get('/loggedIn', loginCtrl.loggedIn);
  app.get('/logout', loginCtrl.loggedOut);
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

  // Post Controls
  app.get('/posts', auth, postCtrl.posts);
  app.post('/post', auth, postCtrl.post);
  app.delete('/post', auth, postCtrl.deletePost);

  // Message Controls
  app.get('/messages', auth, messageCtrl.messages);
  app.post('/conversation', auth, messageCtrl.sendNewConversation);
  app.post('/message', auth, messageCtrl.sendMessage);
  // app.delete('/message', auth, messageCtrl.deleteMessage);
  app.delete('/conversation', auth,messageCtrl.deleteConversation);

  // Barter Request Controls
  app.put('/barter/accept', auth, barterCtrl.acceptBarter);
  app.put('/barter/reject', auth, barterCtrl.rejectBarter);
};
