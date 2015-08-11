"use strict";

var express = require('express');
var Player = require("./player.js");
var World = require("./world.js");
var Gameserver = require("./gameserver.js");
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
  game = new Gameserver();

  game.on('started', function() { 
    // console.log('A new game is started');
  });

  game.on('finished', function() { 
    console.log('Game is finished');
  });

  game.on('restart', function(data) { 
    io.emit('restart', data);
  });

  game.on('update', function(data) { 
    io.emit('render', data);
  });

  game.on('countdown', function(data) { 
    io.emit('countdown', data);
  });

  setInterval(loop, C.TICK_TIME);
});


io.on('connection', function(socket) {

  var player = game.createPlayer(); // TODO Add player to game. Only on new game it's added to world
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
    console.log(socket.userId + " disconnected");
    game.removePlayer(socket.userId);

    socket.broadcast.emit('user left', {
      player: socket.userId,
      world: game.world
    });
  });

  socket.on('message', function(message) {
    console.log(socket.userId, " said: ", message);
  });

});

