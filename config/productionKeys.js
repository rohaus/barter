module.exports = {
  production: {
    clientID: process.env['FB_CLIENT_ID'],
    clientSecret: process.env['FB_CLIENT_SECRET'],
    secret: process.env['NODE_ENV'],
    URL: process.env['FB_URL'],
    DB: process.env['MONGOLAB_URI']
  }
};