
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var motors = new Motors();
var display = new Display();

app.get('/', function(req,res) {
  app.locals.host = req.host;
  res.render('index');
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

