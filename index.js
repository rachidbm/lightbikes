// Constants
var C = {
  WORLD: {
    WIDTH: 640,
    HEIGHT:480
  },
  PLAYER: {
    SIZE: 10
  },
  DIRECTION: {
    NOT_MOVING: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
  },
  TICK_TIME: 100,
};

// Setup basic express server
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

var users = {};
// var totalUsers = 0;
var world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT);

// Routing
app.use(express.static(__dirname + '/public'));

// Startup 
server.listen(port, function () {
  console.log('Example app listening at http://%s:%s', host, port);
  console.log('Server listening at port %d', port);
  console.log("Settings; ", C);
  startLoop();
});


// Main loop, will be called every 'X' time 
function loop() {
  // logLoop();
  world.movePlayers();

  io.emit('draw', {
    players: world.players, 
    totalPlayers: world.getTotalPlayers(),
    world: world
  });
}


function clientConnected(socket) {
  var player = new Player(uuid.v4(), getNiceColor(), C.PLAYER.SIZE);
  socket.userId = player.id;

  world.addPlayerToBoard(player);
  // addRandomPlayer();

  // console.log("Resp: " + util.inspect(resp, false, 1));
  socket.emit('connected', {
    id: player.id, 
    totalPlayers: world.getTotalPlayers(),
    world: world
  });
}


io.on('connection', function (socket) {  

  clientConnected(socket);
  console.log(socket.userId + " connected");

  // echo globally (all clients) that a person has connected
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
    // console.log("change direction: " + newDirection + " for player: ", player.id);
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



function getNiceColor() {
  var niceColors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', 
      '#d62728', '#ff9896', '#9467bd', '#c5b0d5',  '#8c564b', '#c49c94', '#e377c2', 
      '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22',  '#dbdb8d', '#17becf', '#9edae5'];
    // '#e21400', '#91580f', '#f8a700', '#f78b00', '#58dc00', '#287b00', 
    // '#a8f07a', '#4ae8c4', '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  return niceColors[(Math.random() * niceColors.length)|0];
}

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