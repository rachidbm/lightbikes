var io = require('socket.io-client');
var Robot = require('./robot.js');

var host = process.env.HOST || 'ws://localhost:3000';
var actionSpeed = process.env.AGENT_ACTIONSPEED || 1;
console.log("Connecting to:", host);

var socket = io(host);

var robot = null;


function directionChangedCallback(newDirection) {
	// console.log("emit change direction", newDirection);
	socket.emit("change direction", newDirection);
}

socket.on('connected', function(data) {
	console.log("Connected to server, got ID: ", data.id);
	console.log("Starting robot with actionSpeed:", actionSpeed);
	robot = new Robot(data.id, directionChangedCallback, actionSpeed);
	console.log("I am: ", data.world.players[data.id]);
});

socket.on("disconnect", function() {
	console.log("disconnected from server");
	robot = null;
});

socket.on('render', function(data) {
	robot.tick(data.world);
});