// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var util = require('util');

var TICK_TIME = 500;  // ms to waith for each tick

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

var prevMillis = 0;
// Main loop, will be called every 'X' time 
function loop() {
   var d = new Date();
  // console.log("Looping " + d);
  var deviation = (d.getTime() - prevMillis) - TICK_TIME;
  console.log("Looping deviation: " + deviation + " ms");
  prevMillis = d.getTime();

  io.emit('move', {
    serverTime: d
  });

}


function getNiceColor() {
  var niceColors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', 
      '#d62728', '#ff9896', '#9467bd', '#c5b0d5',  '#8c564b', '#c49c94', '#e377c2', 
      '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22',  '#dbdb8d', '#17becf', '#9edae5'];
    // '#e21400', '#91580f', '#f8a700', '#f78b00', '#58dc00', '#287b00', 
    // '#a8f07a', '#4ae8c4', '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  return niceColors[(Math.random() * niceColors.length)|0];
}

function clientConnected(socket) {
  // we store the username in the socket session for this client
  var username = getNiceColor();
  socket.username = username;
  // add the client's username to the global list
  usernames[username] = username;
  ++numUsers;
  // console.log("Resp: " + util.inspect(resp, false, 1));
  socket.emit('connected', {
    id: username, 
    numUsers: numUsers
  });
}

io.on('connection', function (socket) {  
  //console.log(util.inspect(socket, false, 1));
  clientConnected(socket);

  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    username: socket.username,
    numUsers: numUsers
  });
  console.log(socket.username + " connected");


  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    // if (addedUser) {
      console.log(socket.username + " disconnected");
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    // }
  });
});




var startLoop = function () {
    setTimeout(startLoop, TICK_TIME);
    loop();
}
startLoop();
