"use strict";
var express = require('express');
var Player = require("./player.js");
var World = require("./world.js");
var Game = require("./game.js");
var C = require("./config");
var port = process.env.PORT || 3000;
var host = process.env.HOST || 'localhost';

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var game;

// Routing
app.use(express.static(__dirname + '/../3d-client'));
app.use('/3d', express.static(__dirname + '/../3d-client'));
app.use('/2d', express.static(__dirname + '/../client'));


// Main loop, will be called every 'X' time, see C.TICK_TIME
function loop() {
  game.update();
}


// Startup 
server.listen(port, function() {
  console.log('Server listening at %s:%s', host, port);
  console.log("Settings; ", C);
  // world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT, C.PLAYER.SIZE, onWorldRestart);
  game = new Game(io, function onWorldRestart() {
    io.emit('restart', {
      world: game.world
    });
  });
  setInterval(loop, C.TICK_TIME);
});



io.on('connection', function(socket) {

  var player = game.world.createPlayer();
  socket.userId = player.id;

  socket.emit('connected', {
    id: player.id,
    world: game.world
  });

  socket.broadcast.emit('user joined', {
    player: socket.userId,
    world: game.world
  });

  socket.on('restart', function() {
    game.restart();
  });

  socket.on('toggle pause', function() {
    game.togglePause();
  });

  socket.on('change direction', function(newDirection) {
    game.playerMoved(socket.userId, newDirection);
  });

  socket.on('disconnect', function() {
    // remove the userId from global userIds list
    console.log(socket.userId + " disconnected");
    game.world.removePlayer(socket.userId);

    socket.broadcast.emit('user left', {
      player: socket.userId,
      world: game.world
    });
  });

  socket.on('message', function(message) {
    console.log(socket.userId, " said: ", message);
  });

});

