module.exports = function(app, passport, db){
  var loginCtrl = require('../app/controllers/login'),
  barterCtrl = require('../app/controllers/barter'),
  postCtrl = require('../app/controllers/post'),
  messageCtrl = require('../app/controllers/message');

  // Middleware used to determine if the user is authenticated
  var auth = function (req, res, next){
    !req.isAuthenticated() ? res.send(401) : next();
  };

  // Login Routes
  app.get('/', loginCtrl.index);
  app.get('/loggedIn', loginCtrl.loggedIn);
  app.get('/logout', loginCtrl.loggedOut);
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/callback/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

  // Post Controls
  app.get('/posts', auth, postCtrl.posts);
  app.post('/post', auth, postCtrl.post);
  app.delete('/post/:id', auth, postCtrl.deletePost);

  // Message Controls
  app.post('/conversation', auth, messageCtrl.sendNewConversation);
  app.post('/message', auth, messageCtrl.sendMessage);
  app.delete('/conversation/:id', auth,messageCtrl.deleteConversation);

  // Barter Request Controls
  app.put('/barter/accept/:id', auth, barterCtrl.acceptBarter);
  app.put('/barter/reject/:id', auth, barterCtrl.rejectBarter);
};
