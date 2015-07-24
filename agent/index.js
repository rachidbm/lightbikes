var io = require('socket.io-client');
var Agent = require('./agent.js');

var host = process.env.HOST || 'ws://localhost:3000';
console.log("Connecting to:", host);

var socket = io(host);

var agent = null;


function directionChangedCallback(newDirection) {
	// console.log("emit change direction", newDirection);
	socket.emit("change direction", newDirection);
}

socket.on('connected', function (data) {
  console.log("Connected to server, got ID: ", data.id);
  agent = new Agent(data.id, directionChangedCallback);
  console.log("I am: ", data.world.players[data.id]);
});

socket.on("disconnect", function(){
  console.log("disconnected from server");
  agent = null;
});

socket.on('render', function (data) {
  agent.tick(data.world);
});
