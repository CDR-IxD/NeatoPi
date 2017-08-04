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
    var parsed = message.split(",");
    var left = parsed[0];
    var right = parsed[1];
    var speed = parsed[2];
    console.log("Left: " + parsed[0] + " Right: " + parsed[1] + " Speed: " + parsed[2]);
    drive(left, right, speed);
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
/*
	  var right = 50;
	  var left = 10;
	  var speed = 40;
	  drive(left, right, speed);
*/
  });


});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

/********************* Private Functions *********************/

// drive the robot from messsages
function drive(LWheelDist, RWheelDist, Speed) {
//	for(var i = 0; i < 50; i++) {
  console.log('SetMotor LWheelDist ' + LWheelDist +
             ' RWheelDist ' + RWheelDist + ' Speed ' + Speed + '\n');

/*
	setTimeout(function() {
}, 500);
*/

  port.write('SetMotor LWheelDist ' + LWheelDist +
             ' RWheelDist ' + RWheelDist + ' Speed ' + Speed + '\n');
// 	}

	console.log("written to port");
}


