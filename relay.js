'use strict';
var io = require('socket.io-client');
var gaze = require('gaze');
var fs = require('fs');
var path = require('path');
var logger = require('winston');
var config = require('./config')(logger);
var prompt = require('prompt');

var directory = path.resolve(__dirname, process.argv[2]);

var todoList = {};

if (!directory) {
  logger.error("Usage: node server.js /path/to/directory");
  process.exit(1);
}

logger.info('listening on %s', directory);

var SOCKET_IO_URL = config.server.exposed_endpoint + '/?access_token=' + config.auth.token;

logger.info('connecting...');
var sio = io(SOCKET_IO_URL, {
  transports: ['websocket', 'polling'],
  multiplex: false
});

sio.on('connect', function() {
  logger.info('connected!');
});

gaze(directory, function(err, watcher) {
  if (err) {
    throw err;
  }

  // Get all watched files
  this.watched(function(err, watched) {
    console.log(watched);
  });

  // On file changed
  this.on('changed', function(filepath) {
    sio.emit('file:changed',
      path.basename(filepath),
      Date.now(),
      fs.readFileSync(filepath, 'utf-8') // @todo use async mode
    );
  });

  // On file added
  this.on('added', function(filepath) {
    console.log(filepath + ' was added');
  });

  // On file deleted
  this.on('deleted', function(filepath) {
    console.log(filepath + ' was deleted');
  });

  // On changed/added/deleted
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
  });

  // Get watched files with relative paths
  this.relative(function(err, files) {
    console.log(files);
  });

});

prompt.start();

function read() {
    prompt.get(['cmd'], function (err, result) {
      if (typeof result !== 'undefined') {
        var parts = result.cmd.split(" ");
        if(parts[0].toUpperCase() === "TODO" || parts[0].toUpperCase() === "TD"){
          var operation = parts[1].toUpperCase();
          parts.splice(0,2);
          var task = parts.join(" ");
          switch (operation) {
            case "ADD":
              todoList[task] = 0;
            break;
            case "DELETE":
            case "D":
              delete todoList[task];
            break;
            case "COMPLETE":
            case "C":
              todoList[task] = 1;
            break;
            case "UNCOMPLETE":
            case "U":
              todoList[task] = 0;
            break;
            case "HELP":
              console.log("add [taskName]");
              console.log("  Add a task");
              console.log("delete/del [taskName]");
              console.log("  Delete a task");
              console.log("complete/c [taskName]");
              console.log("  Complete a task");
              console.log("uncomplete/u [taskName]");
              console.log("  Uncomplete a task");
              console.log("help");
              console.log("   Show this");
            break;
            default:
              console.log("Undefined operation");
          }
        }
        sio.emit('todo:updated',todoList);
        read();
      }

    });
}

read();
