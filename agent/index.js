var io = require('socket.io-client');
var Agent = require('./agent.js');

//var port = process.env.PORT || 3000;
//var host = process.env.HOST || 'localhost';
// var host = process.env.HOST || 'localhost:3000';
var host = 'ws://192.168.59.104:3000';

console.log("env.HOST:", process.env.HOST);

// var host = 'ws://localhost:3000';
//var host = 'ws://192.168.59.104:3000';

console.log("Connecting to:", host);
var socket = io(host); // Now we can open static HTML without having the nodejs server running

var agent = null;


function directionChangedCallback(newDirection) {
	console.log("emit change direction", newDirection);
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

socket.on('user joined', function (data) {
  console.log(data.player + ' joined. ');
});

socket.on('user left', function (data) {
  console.log(data.player + ' left. ');
});

socket.on('render', function (data) {
  agent.tick(data.world);
});