module.exports = function(app, passport, db){
  var loginCtrl = require('../app/controllers/loginCtrl'),
  barterCtrl = require('../app/controllers/barterCtrl'),
  postCtrl = require('../app/controllers/postCtrl'),
  messageCtrl = require('../app/controllers/messageCtrl');

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
  app.get('/items', auth, postCtrl.items);
  app.post('/post', auth, postCtrl.post);
  app.post('/deletePost', auth, postCtrl.deletePost);

  // Message Controls
  app.get('/messages', auth, messageCtrl.messages);
  app.post('/sendNewConversation', auth, messageCtrl.sendNewConversation);
  app.post('/sendMessage', auth, messageCtrl.sendMessage);
  // app.post('/deleteMessage', auth, messageCtrl.deleteMessage);
  app.post('/deleteConversation', auth,messageCtrl.deleteConversation);

  // Barter Request Controls
  app.post('/acceptBarter', auth, barterCtrl.acceptBarter);
  app.post('/rejectBarter', auth, barterCtrl.rejectBarter);
};
