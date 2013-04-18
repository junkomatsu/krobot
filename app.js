
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , config = require('config')
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , Motors = require('./motors')
  , Display = require('./display');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('krobotsecret'));
  app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var FACEBOOK_APP_ID = config.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = config.FACEBOOK_APP_SECRET;
var TWITTER_CONSUMER_KEY = config.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = config.TWITTER_CONSUMER_SECRET;
var HOST = config.HOST;
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var motors = new Motors();
var display = new Display();

// initialize passport

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});

passport.use(new FacebookStrategy(
{
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://" + HOST + "/auth/facebook/callback",
},
function(accessToken, refreshToken, profile, done) {
  passport.session.accessToken = accessToken;
  passport.session.profile = profile;
  console.log(profile);
  process.nextTick(function() {
    profile.image = 'https://graph.facebook.com/' + profile.username + '/picture';
    display.setAvatar(profile.image);
    done(null, profile);
  });
}));


passport.use(new TwitterStrategy(
{
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "http://" + HOST + "/auth/twitter/callback"
},
function(token, tokenSecret, profile, done) {
  passport.session.accessToken = token;
  passport.session.profile = profile;
  console.log(profile);
  process.nextTick(function () {
    profile.image = profile.photos[0].value;
    display.setAvatar(profile.image);
    return done(null, profile);
  });
}));

app.get('/', function(req,res) {

  console.log(req.user);
  if (req.user == undefined) {
    res.redirect('/login');
  } else {
    app.locals.host = req.host;
    app.locals.provider = req.user.provider;
    app.locals.image = req.user.image;
    if (req.user.provider == 'twitter') {
      app.locals.username = '@' + req.user.username;
    } else {
      app.locals.username = req.user.displayName;
    }
    res.render('index');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/auth/fail'}),
  function(req, res) {
    res.redirect('/');
  }
);
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/auth/fail'}),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/go', function(req, res) {
  motors.go();
  res.send('ok');
});
app.get('/stop', function(req, res) {
  motors.stop();
  res.send('ok');
});
app.get('/back', function(req,res) {
  motors.back();
  res.send('ok');
});
app.get('/left', function(req, res) {
  motors.left();
  res.send('ok');
});
app.get('/right', function(req, res) {
  motors.right();
  res.send('ok');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

