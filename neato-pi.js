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

// Setup the connection to the server
var SerialPort = require("serialport");
var socket = require('socket.io-client')('http://cdr-ubuntu.local:3000');

// connect to server
socket.on('connect', function(){
  // tell server it is a neato connecting
  socket.emit('storeClientInfo', { clientType: "Neato"});
  
  // pass drive messages to Neato
  socket.on('drive2Neato', function(data){
    console.log("drive:", data);
    drive(data.LWheelDist, data.RWheelDist, data.Speed);
  });

  socket.on('disconnect', function(){});
});

/********************* Neato Functions *********************/

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

  //testPath();
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
