$(function() {
  var $window = $(window);
  var $logArea = $('.logArea'); // Char area
  var connected = false;

  var socket = io();
  var ctx = $('#world')[0].getContext("2d");


  function setupWorld(world) {
    console.log("Setup world: ", world);
    ctx.canvas.width = world.width;
    ctx.canvas.height = world.height;
  }


  function draw(players) {
    for (var id in players) {
      var p = players[id];
      drawRect(p.x, p.y, p.size, p.color);
    }
  }

  function drawRect(x, y, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.closePath();
      ctx.fill();      
  }


  function logClients (data) {
    $logArea.text("clients: " + data.totalPlayers);
  }


  // Keyboard events
  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      // $currentInput.focus();
    }

    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
    }

    var newDirection = 0;
    switch(event.keyCode) {
    case 37: // LEFT
    case 38: // UP
    case 39: // RIGHT 
    case 40: // DOWN
      newDirection = event.keyCode;
      break;
    }
    if(newDirection > 0) {
      // console.log("newDirection: ", newDirection);
      // TODO: check if current direction is changed
      socket.emit("change direction", newDirection);
    }

  });


  socket.on('connected', function (data) {
    console.log("Connected to server, got ID: ", data.id);
    console.log("data: ", data);
    connected = true;
    setupWorld(data.world);

    logClients(data);
    draw();
  });

  socket.on('user joined', function (data) {
    console.log(data.player + ' joined, ', data);
    logClients(data);
  });

  socket.on('user left', function (data) {
    console.log(data.player + ' left. ', data);
    logClients(data);
  });

  socket.on('draw', function (data) {
    // console.log("draw: ", data);
    draw(data.players);
  });


});