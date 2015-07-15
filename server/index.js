
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var host = process.env.HOST || '*';
var util = require('util');
var uuid = require('uuid');
var Player = require("./player.js");
var World = require("./world.js");
var C = require("./config");

var users = {};
var world;

// Routing
app.use(express.static(__dirname + '/../client'));

// Startup 
server.listen(port, function () {
  console.log('Server listening at http://%s:%s', host, port);
  console.log("Settings; ", C);
  world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT, C.PLAYER.SIZE);
  startLoop();
});


// Main loop, will be called every 'X' time 
function loop() {
  // logLoop();
  world.movePlayers();

  io.emit('draw', {
    totalPlayers: world.getTotalPlayers(),
    world: world
  });
}


function clientConnected(socket) {
  var player = world.createPlayer();
  socket.userId = player.id;

  socket.emit('connected', {
    id: player.id, 
    totalPlayers: world.getTotalPlayers(),
    world: world
  });
}


io.on('connection', function (socket) {  

  clientConnected(socket);
  console.log(socket.userId + " connected");

  socket.broadcast.emit('user joined', {
    player: socket.userId,
    totalPlayers: world.getTotalPlayers(),
    world: world
  });

  socket.on('toggle pause', function (newDirection) {
    world.togglePause();
  });

  socket.on('change direction', function (newDirection) {
    var p = world.players[socket.userId];
    switch(newDirection) {
    case 37: // LEFT
      p.left();
      break;
    case 38: // UP
      p.up();
      break;
    case 39: // RIGHT 
      p.right();
      break;
    case 40: // DOWN
      p.down();
      break;
    }
  });

  socket.on('disconnect', function () {
    // remove the userId from global userIds list
      console.log(socket.userId + " disconnected");
      world.removePlayer(socket.userId);

      socket.broadcast.emit('user left', {
        player: socket.userId,
        totalPlayers: world.getTotalPlayers(),
        world: world
      });
  });

});


var prevMillis = 0;
function logLoop() {
  var d = new Date();
  var deviation = (d.getTime() - prevMillis) - C.TICK_TIME;
  console.log("Looping deviation: " + deviation + " ms");
  prevMillis = d.getTime();
}


var startLoop = function () {
    setTimeout(startLoop, C.TICK_TIME);
    loop();
}