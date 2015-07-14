$(function() {
  var FADE_TIME = 150; // ms

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $logArea = $('.logArea'); // Char area
  var $currentInput = $usernameInput.focus();

  // Prompt for setting a username
  var username;
  var connected = false;

  var socket = io();
  var ctx = $('#world')[0].getContext("2d");
  var size = 10;

  function setupWorld(world) {
    console.log("Setup world: ", world);
    ctx.canvas.width = world.width;
    ctx.canvas.height = world.height;
  }


  function draw(players) {

    // console.log(Object.keys(players));

    for (var id in players) {
      var p = players[id];
      drawRect(p.x, p.y, p.size, p.color);
    }
    // var p = players[0]
    // //get a reference to the canvas
    // ctx.fillStyle = username;
    // ctx.beginPath();
    // // ctx.arc(75, 75, 10, 0, Math.PI*2, true); 
    // ctx.rect(50, 50, size, size);
    // ctx.closePath();
    // ctx.fill();
  }

  function drawRect(x, y, size, color) {

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.closePath();
      ctx.fill();      
  }


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
    console.log("Connected to server, got ID: ", data.id);
    console.log("data: ", data);
    username = data.id;
    connected = true;
    setupWorld(data.world);

    logClients(data);
    draw();
  });

  socket.on('user joined', function (data) {
    // log(data.username + ' joined');
    logClients(data);
  });

  socket.on('user left', function (data) {
    // log(data.username + ' left');
    logClients(data);
  });

  socket.on('draw', function (data) {
    // console.log("draw: ", data);
    draw(data.players);
  });


});