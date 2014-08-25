'use strict';

var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var Log = require('log');
var path = require('path');
var fs = require('fs');

var debug = require('debug')('express-antenna-cocoalumberjack');

var port = process.env.NODE_EXPRESS_ANTENNA_PORT || 3205;
var logPath = process.env.NODE_EXPRESS_ANTENNA_LOG_PATH || null;

var logger = null;

if(!_.isNull(logPath)){
  logger = new Log('info', fs.createWriteStream(path.join(logPath, 'antenna-cocoalumberjack.log'), {flags: 'a'}));
}

var app = express();

app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var router = express.Router();
app.use('/', router);

// run the app as DEBUG=* node app.js to see the debug messages
router.use(function(req, res, next){
	debug(req.method + ' ' + req.url);
	next();
});

// This method allows you to verify that your service is reachable.
// Open a browser and point to http[s]://yourhost[:port]/ping
router.get('/ping', function(req, res){
	res.json({pong: new Date().toISOString()});
});

router.post('/log', function(req, res){
  var object = _.pick(req.body, ['locale', 'notification', 'uuid', 'json', 'message', 'modified_unix_date']);
  var message = JSON.stringify(object);

  if(_.isNull(logger) || _.isUndefined(logger)){
    console.log(new Date().toISOString(), message);
  } else {
    logger.info(message);
  }

  res.status(200).end();
});

var server;
server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
