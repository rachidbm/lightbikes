// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var util = require('util');
var uuid = require('uuid');
var Player = require("./player.js");

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


server.listen(port, function () {
  console.log('Server listening at port %d', port);
  console.log("Settings; ", C);
});

// Routing
app.use(express.static(__dirname + '/public'));

// userIds which are currently connected to the chat
var users = {};
var numUsers = 0;


// Main loop, will be called every 'X' time 
function loop() {
  // logLoop();
  for (var id in users) {
    var p = users[id];
    p.move();  
  }

  io.emit('draw', {
    players: users
  });
}


function clientConnected(socket) {
  var player = new Player(uuid.v4(), getNiceColor(), C.PLAYER.SIZE);
  socket.userId = player.id;

  addPlayerToBoard(player);
  // addRandomPlayer();

  // console.log("Resp: " + util.inspect(resp, false, 1));
  socket.emit('connected', {
    id: player.id, 
    numUsers: numUsers,
    world: {
      width: C.WORLD.WIDTH,
      height: C.WORLD.HEIGHT
    }
  });
}


function addRandomPlayer() {
  var player = new Player(uuid.v4(), getNiceColor(), C.PLAYER.SIZE);
  addPlayerToBoard(player);
}


function addPlayerToBoard(player){
  var pos = Object.keys(users).length * C.PLAYER.SIZE + C.PLAYER.SIZE;
  player.x = pos;
  player.y = pos;
  player.direction = C.DIRECTION.RIGHT;
  //console .log("Place player on the board", player);
  users[player.id] = player;
  ++numUsers;
}

io.on('connection', function (socket) {  
  clientConnected(socket);

  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    userId: socket.userId,
    numUsers: numUsers
  });
  
  console.log(socket.userId + " connected");

  // when the client emits 'new message', this listens and executes
    socket.on('change direction', function (newDirection) {
      var p = users[socket.userId];
      // console.log("change direction: " + newDirection + " for player: ", player.id);
      switch(newDirection) {
      case 37: // LEFT
        // newDirection = C.DIRECTION.LEFT;
        p.left();
        break;
      case 38: // UP
        // newDirection = C.DIRECTION.UP;
        p.up();
        break;
      case 39: // RIGHT 
        // newDirection = C.DIRECTION.RIGHT;
        p.right();
        break;
      case 40: // DOWN
        // newDirection = C.DIRECTION.DOWN
        p.down();
        break;
      }
      // users[socket.userId].direction = newDirection;
    });


  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the userId from global userIds list
      console.log(socket.userId + " disconnected");
      delete users[socket.userId];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        userId: socket.userId,
        numUsers: numUsers
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
startLoop();