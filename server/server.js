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
var countingDown = false;

// Routing
app.use(express.static(__dirname + '/../3d-client'));
app.use('/3d', express.static(__dirname + '/../3d-client'));
app.use('/2d', express.static(__dirname + '/../client'));


// Startup 
server.listen(port, function() {
  console.log('Server listening at %s:%s', host, port);
  console.log("Settings; ", C);
  world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT, C.PLAYER.SIZE, onWorldRestart);
  setInterval(loop, C.TICK_TIME);
});


// Main loop, will be called every 'X' time, see C.TICK_TIME
function loop() {
  if(countingDown || world.getTotalPlayers() < 1) {
    return;
  }
  world.movePlayers();
  if(world.restartWhenAllPlayersDied()) {
    startNewGame(world, 3);
  } else {
    countingDown = false;
    io.emit('render', {
      totalPlayers: world.getTotalPlayers(),
      world: world
    });
  }
}

var startNewGame = function(world, seconds) {
  world.restart();
  countingDown = true;
  var intervalId = setInterval(function() {
    if(seconds > 0) {
      console.log('Start new game in:', seconds);
      io.emit('countdown', {
        seconds: seconds 
      });
      seconds--;
    } else {
      clearInterval(intervalId);
      countingDown = false;
      // Start the game!
      world.pause(false);
    }
  }, 1000);

};


function clientConnected(socket) {
  var player = world.createPlayer();
  socket.userId = player.id;

  socket.emit('connected', {
    id: player.id,
    totalPlayers: world.getTotalPlayers(),
    world: world
  });
}

function onWorldRestart() {
  io.emit('restart', {
    world: world
  });
}

io.on('connection', function(socket) {

  clientConnected(socket);

  socket.broadcast.emit('user joined', {
    player: socket.userId,
    totalPlayers: world.getTotalPlayers(),
    world: world
  });


  socket.on('restart', function() {
    startNewGame(world, 3);
  });

  socket.on('toggle pause', function() {
    world.togglePause();
  });

  socket.on('change direction', function(newDirection) {
    var p = world.players[socket.userId];
    switch (newDirection) {
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

  socket.on('disconnect', function() {
    // remove the userId from global userIds list
    console.log(socket.userId + " disconnected");
    world.removePlayer(socket.userId);

    socket.broadcast.emit('user left', {
      player: socket.userId,
      totalPlayers: world.getTotalPlayers(),
      world: world
    });
  });

  socket.on('message', function(message) {
    console.log(socket.userId, " said: ", message);
  });

});

