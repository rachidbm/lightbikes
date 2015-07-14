// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var util = require('util');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

function getNiceColor() {
  var niceColors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', 
      '#d62728', '#ff9896', '#9467bd', '#c5b0d5',  '#8c564b', '#c49c94', '#e377c2', 
      '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22',  '#dbdb8d', '#17becf', '#9edae5'];
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
  socket.emit('login', {
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

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });


  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

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
