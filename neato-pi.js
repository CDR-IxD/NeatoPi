/*************************************************************
Filename: neato-pi.js

Description: This file is to be run on raspberry pi's attached to the Neato.
It receives messages from the server and sends them to the Neato through serial
port.

Author: tlee
Notes:
    first release 4/28/17
*************************************************************/

/********************* Server Functions *********************/

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
  console.log('connected');
  ws.on('message', function incoming(message) {
    if (message == "ping") {
      ws.send('pong: '+port.isOpen)
      return;
    }
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.error("Unable to parse message", message, e);
      return;
    }
    drive(message.left, message.right, message.speed, message.accel);
  });
});

/********************* Neato Functions *********************/


var SerialPort = require("serialport");

// Setup the connection to the Neato
var port = new SerialPort("/dev/ttyACM0", {
  baudRate: 115200
});

// Open the port and put the robot into testmode ON so we can drive
port.on('open', function() {
  port.write('testmode on' + '\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('Neato Ready!');
  });


});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

/********************* Private Functions *********************/

var DRIVE_COMMAND_INTERVAL = 20; // ms between SetMotor commands.

var lastDriveTime = Date.now() - DRIVE_COMMAND_INTERVAL;
var nextDriveCommand;
var nextDriveTimeout = null;

function sendDrive() {
  console.log(nextDriveCommand);
  port.write(nextDriveCommand);
  lastDriveTime = Date.now();
  nextDriveTimeout = null;
}

function round(n, digits) {
  var m = Math.pow(10, digits);
  return Math.round(m * n) / m;
}

// drive the robot from messsages
function drive(LWheelDist, RWheelDist, Speed, Accel) {
  var msg = 'SetMotor LWheelDist ' + round(LWheelDist, 0) + ' RWheelDist ' + round(RWheelDist, 0) + 
            ' Speed ' + round(Speed, 0) + '\n';
  nextDriveCommand = msg;
    
  var now = Date.now();
  if (now < lastDriveTime + DRIVE_COMMAND_INTERVAL) {
    if (! nextDriveTimeout) {
      nextDriveTimeout = setTimeout(sendDrive, lastDriveTime + DRIVE_COMMAND_INTERVAL - now);
    }
  } else {
    sendDrive();
  }
}


