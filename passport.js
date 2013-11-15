module.exports = function(passport, FacebookStrategy, FbUsers){
  // var keys = require('./keys');
  // Authentication Strategy
  passport.use(new FacebookStrategy({
    clientID: FB_CLIENT_ID || keys.clientID,
    clientSecret: FB_CLIENT_SECRET || keys.clientSecret,
    callbackURL: FB_URL || keys.URL
  },
  function (accessToken, refreshToken, profile, done){
    FbUsers.findOne({fbId : profile.id}, function (err, oldUser){
      if(oldUser){
        done(null,oldUser);
      }else{
        var newUser = new FbUsers({
          fbId : profile.id ,
          name : profile.displayName
        }).save(function (err,newUser){
          if(err) throw err;
          done(null, newUser);
        });
      }
    });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

};