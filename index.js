// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var util = require('util');
var uuid = require('uuid');
var Player = require("./player.js");

var TICK_TIME = 1000;  // ms to waith for each tick
var WORLD_WIDTH = 640;
var WORLD_HEIGHT = 480;
var PLAYER_SIZE = 20;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// userIds which are currently connected to the chat
var users = {};
var numUsers = 0;


var prevMillis = 0;



// Main loop, will be called every 'X' time 
function loop() {
  var d = new Date();
  var deviation = (d.getTime() - prevMillis) - TICK_TIME;
  // console.log("Looping deviation: " + deviation + " ms");
  prevMillis = d.getTime();

  io.emit('draw', {
    players: users
  });

}


function clientConnected(socket) {
  // console.log("users.length: ",  Object.keys(users));
  // we store the username in the socket session for this client
  // console.log("nr of connected users: ", Object.keys(users).length);
  // var pos = Object.keys(users).length * PLAYER_SIZE;
  // console.log("pos: ", pos)

  var player = new Player(uuid.v4(), getNiceColor(), PLAYER_SIZE);
  // console.log("Connected player: ", player);
  socket.userId = player.id;

  addPlayerToBoard(player);
  // addRandomPlayer();

  // console.log("Resp: " + util.inspect(resp, false, 1));
  socket.emit('connected', {
    id: player.id, 
    numUsers: numUsers,
    world: {
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT
    }
  });
}


function addRandomPlayer() {
  var player = new Player(uuid.v4(), getNiceColor(), PLAYER_SIZE);
  addPlayerToBoard(player);
}


function addPlayerToBoard(player){
  var pos = Object.keys(users).length * PLAYER_SIZE + PLAYER_SIZE;
  player.x = pos;
  player.y = pos;
  console .log("Place player on the board", player);

    users[player.id] = player;
  ++numUsers;

}

io.on('connection', function (socket) {  
  //console.log(util.inspect(socket, false, 1));
  clientConnected(socket);

  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    userId: socket.userId,
    numUsers: numUsers
  });
  console.log(socket.userId + " connected");


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


var startLoop = function () {
    setTimeout(startLoop, TICK_TIME);
    loop();
}
startLoop();
