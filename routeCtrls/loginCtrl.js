var index = function (req, res, next) {
  res.render('index');
};

var loggedIn = function (req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
};

var loggedOut = function (req, res){
  req.logOut();
  res.redirect('/');
};

module.exports = {
  index: index,
  loggedIn: loggedIn,
  loggedOut: loggedOut
};
