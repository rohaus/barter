var db = require('./database/database'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    FbUsers = require('./database/schema/facebook').FbUsers,
    keys = require('./keys'),
    app = require('./config')(passport);

require('./passport')(passport, FacebookStrategy, FbUsers);
require('./routes')(app, passport, db);

app.listen(9000);
