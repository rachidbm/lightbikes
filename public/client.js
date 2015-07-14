$(function() {
  var FADE_TIME = 150; // ms

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $logArea = $('.logArea'); // Char area
  //var $inputMessage = $('.inputMessage'); // Input message input box

  //var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  function logClients (data) {
    var message = '';
    message = " clients: " + data.numUsers;
    // log(message);
    $logArea.text(message);
  }


  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }

    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
    }
    // LEFT, RIGHT, UP, DOWN
  });

  // Socket events

  socket.on('connected', function (data) {
    console.log("Connected to server, got ID: " + data.id)
    username = data.id;
    connected = true;
    logClients(data);
    //$chatPage.show();
  });

  socket.on('user joined', function (data) {
    // log(data.username + ' joined');
    logClients(data);
  });

  socket.on('user left', function (data) {
    // log(data.username + ' left');
    logClients(data);
  });

  socket.on('move', function (data) {
    // console.log("move: " + data.serverTime);
  });

});
