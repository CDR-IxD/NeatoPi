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

const wss = new WebSocket.server({port: 3000});

wss.on('connection', function connection(ws) {
  console.log('connected');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var parsed = message.split(",");

    // pwm_right = parsed[1]
    // pwm_left = parsed[2]
    console.log("Right: " + parsed[1] + " Left: " + parsed[2]);

  });
});
// Setup the connection to the server
// var socket = require('socket.io-client')('http://ubuntu-cdr.local:3000');
//var io = require('socket.io').listen(3000);

//io.sockets.on('connection', function(socket){
  //// tell server it is a neato connecting
  //// socket.emit('storeClientInfo', { clientType: "Neato"});
  //console.log("Connected to port 3000");

  //// pass drive messages to Neato
  //socket.on(0, function(data){
    //console.log("drive:", data);
    ////drive(data.LWheelDist, data.RWheelDist, data.Speed);
  //});

  //socket.on('disconnect', function(){});
//});

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

// drive the robot from messsages
function drive(LWheelDist, RWheelDist, Speed) {
  console.log('SetMotor LWheelDist ' + LWheelDist +
             ' RWheelDist ' + RWheelDist + ' Speed ' + Speed + '\n')
  port.write('SetMotor LWheelDist ' + LWheelDist +
             ' RWheelDist ' + RWheelDist + ' Speed ' + Speed + '\n');
}
