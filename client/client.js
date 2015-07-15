$(function() {
  var $window = $(window);
  var $logArea = $('.logArea');
  var $body = $('body');
  var $world = $('#world');

  // var socket = io();   // Connects to URL where client is hosted.
  var socket = io('http://localhost:3000'); // Now we can open static HTML without having the nodejs server running
  
  var ctx = $world[0].getContext("2d");
  var worldBackgroundColor = $('#world').css('backgroundColor');

  showConnectionStatus();

  function setupWorld(world) {
    console.log("Setup world: ", Object.keys(world), world);
    ctx.canvas.width = world.width;
    ctx.canvas.height = world.height;
    render(world);
  }


  function render(world) {
    var grid = world.grid;
    for(var x = 0; x < world.tiles_width; x++) {
      for(var y = 0; y < world.tiles_height; y++) {
        if(grid[x][y] != null) {
          drawRect(x * world.tileSize, y * world.tileSize, world.tileSize, grid[x][y])
        } else {
          drawRect(x * world.tileSize, y * world.tileSize, world.tileSize, worldBackgroundColor);
        }
      }
    }
  }


  function drawRect(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.closePath();
    ctx.fill();      
  }


  function logClients(data) {
    var msg = "clients: " + data.totalPlayers;
    if(data.world.paused) {
      msg += "   (paused) ";
    }
    $logArea.text(msg);
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
    case 32: // SPACE
      socket.emit("toggle pause", newDirection);
      break;
    case 37: // LEFT
      newDirection = 4;
      break;
    case 38: // UP
      newDirection = 1;
      break;
    case 39: // RIGHT 
      newDirection = 2;
      break;    
    case 40: // DOWN
      newDirection = 3;
      break;
    }
    if(newDirection > 0) {
      // console.log("newDirection: ", newDirection);
      // TODO: check if current direction is changed
      socket.emit("change direction", newDirection);
    }

  });

  function showConnectionStatus() {
    if(socket.connected) {
      $body.css("background-color", "#F6FAFC");
    } else {
      $body.css("background-color", "#FFD9D9");
    }
  }
  

  socket.on('connected', function (data) {
    console.log("Connected to server, got ID: ", data.id);
    showConnectionStatus();
    // console.log("data: ", data);
    console.log("I am: ", data.world.players[data.id]);
    setupWorld(data.world);
    // logClients(data);
    // render(data);
  });

  socket.on("disconnect", function(){
    console.log("disconnected from server");
    showConnectionStatus();
  });

  socket.on('user joined', function (data) {
    // console.log(data.player + ' joined, ', data);
    // logClients(data);
  });

  socket.on('user left', function (data) {
    // console.log(data.player + ' left. ', data);
    // logClients(data);
  });

  socket.on('render', function (data) {
    // console.log("render: ", data);
    render(data.world);
    logClients(data);
  });


});