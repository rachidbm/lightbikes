
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var host = process.env.HOST || 'localhost';
var util = require('util');
var uuid = require('uuid');
var Player = require("./player.js");
var World = require("./world.js");
var C = require("./config");

var world;

// Routing
app.use(express.static(__dirname + '/../client'));

// Startup 
server.listen(port, function () {
  console.log('Server listening at %s:%s', host, port);
  console.log("Settings; ", C);
  world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT, C.PLAYER.SIZE);
  startLoop();
});


// Main loop, will be called every 'X' time, see startLoop()
function loop() {
  world.movePlayers();
  io.emit('render', {
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

  socket.broadcast.emit('user joined', {
    player: socket.userId,
    totalPlayers: world.getTotalPlayers(),
    world: world
  });

  socket.on('restart', function () {
    world.restart();
  });

  socket.on('toggle pause', function () {
    world.togglePause();
  });

  socket.on('change direction', function (newDirection) {
    var p = world.players[socket.userId];
    switch(newDirection) {
    case C.DIRECTION.LEFT:
      p.left();
      break;
    case C.DIRECTION.UP:
      p.up();
      break;
    case C.DIRECTION.RIGHT:
      p.right();
      break;
    case C.DIRECTION.DOWN:
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


var startLoop = function () {
    setTimeout(startLoop, C.TICK_TIME);
    loop();
}