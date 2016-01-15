/* jslint node: true */
"use strict";

var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var Log = require('log');
var path = require('path');
var fs = require('fs');

var debug = require('debug')('express-antenna-cocoalumberjack');

var port = process.env.NODE_EXPRESS_ANTENNA_PORT || 3205;
var logPath = process.env.NODE_EXPRESS_ANTENNA_LOG_PATH || null;
var logUrl = process.env.NODE_EXPRESS_ANTENNA_LOG_URL || '/log';

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

// Default endpoint is /log.
// Use export NODE_EXPRESS_ANTENNA_LOG_URL='/api/logging/path' to change it.
router.post(logUrl, function(req, res){
  var default_keys = ['locale', 'notification', 'uuid', 'json', 'message', 'timestamp', 'method', 'log-level', 'file'];
  var custom_keys = ['username', 'user-id', 'device-name', 'department-id', 'app-version'];
  var filter_keys = _.union(default_keys, custom_keys);
  var object = _.pick(req.body, filter_keys);
  var message = JSON.stringify(object);

  var ignored_keys = _.omit(req.body, filter_keys);
  if(_.size(ignored_keys) > 0){
    console.log('ignored keys', ignored_keys);
  }

  if(_.isNull(logger) || _.isUndefined(logger)){
    console.log(new Date().toISOString(), message);
  } else {
    logger.info(message);
  }

  res.status(200).end();
});

var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
