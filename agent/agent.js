var HOST = 'http://localhost:3000';

var io = require('socket.io-client');
var socket = io(HOST); // Now we can open static HTML without having the nodejs server running

var myId = null;

function doStuff(data) {
  var world = data.world;
  if(world.paused) {
    return;
  }
  var moved = false;
  console.log("Move stuff?");
  if(moved) {
  // socket.emit("change direction", newDirection);
  }
  // var grid = world.grid;
}



socket.on('connected', function (data) {
  myId = data.id;
  console.log("Connected to server, got ID: ", myId);
  console.log("I am: ", data.world.players[myId]);
});

socket.on("disconnect", function(){
  console.log("disconnected from server");
});

socket.on('user joined', function (data) {
  console.log(data.player + ' joined. ');
});

socket.on('user left', function (data) {
  console.log(data.player + ' left. ');
});

socket.on('render', function (data) {
  doStuff(data);
});