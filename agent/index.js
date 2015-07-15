var HOST = 'http://localhost:3000';

var io = require('socket.io-client');
var Agent = require('./agent.js');
var socket = io(HOST); // Now we can open static HTML without having the nodejs server running

var agent = null;


socket.on('connected', function (data) {
  console.log("Connected to server, got ID: ", data.id);
  agent = new Agent(data.id);
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