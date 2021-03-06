module.exports = Robot;

var C = require("./config");


function Robot(id, directionChangedCallback, actionSpeed) {
  if (typeof(actionSpeed) === "undefined") { actionSpeed = 1; }
  this.id = id;
  this.tickCounter = 0;
  this.actionSpeed = actionSpeed; // Every 'x' ticks this Robot does something. Change to 0 for an Robot which does nothing
  this.directionChanged = directionChangedCallback;
}

Robot.prototype.tick = function(world) {
  this.tickCounter++;
  if (this.tickCounter % this.actionSpeed !== 0) {
    this.tickCounter = 0;
    return;
  }

  var player = world.players[this.id];
  if (!player.alive) {
    return;
  }
  var currentDirection = player.direction;

  var newDirection = this.calcNextDirection(world, player);

  if (currentDirection != newDirection) {
    this.directionChanged(newDirection);
  }
};

Robot.prototype.calcNextDirection = function(world, player) {
  var nextPos = calcNextPosition(player);

  // Prevent colliding to the border
  if (nextPos.x <= 0) {
    return C.DIRECTION.UP;
  } else if (nextPos.y <= 0) {
    return C.DIRECTION.RIGHT;
  } else if (nextPos.x >= world.grid.length - 1) {
    return C.DIRECTION.DOWN;
  } else if (nextPos.y >= world.grid[nextPos.x].length - 1) {
    return C.DIRECTION.LEFT;
  }

  if (world.grid[nextPos.x][nextPos.y] !== null) {
    // Someone was here!
    return turnRight(player);
  }

  return player.direction;
};

// Return direction when player turns right
function turnRight(player) {
  if ((player.direction) + 1 > 4) {
    return 1;
  }
  return player.direction + 1;
}

// Return direction when player turns left
function turnLeft(player) {
  if ((player.direction) - 1 < 0) {
    return 4;
  }
  return player.direction - 1;
}


function calcNextPosition(player) {

  var x = player.x,
    y = player.y;
  // var step = this.size;
  var step = 1;
  switch (player.direction) {
    case C.DIRECTION.UP:
      y -= step;
      break;
    case C.DIRECTION.RIGHT:
      x += step;
      break;
    case C.DIRECTION.DOWN:
      y += step;
      break;
    case C.DIRECTION.LEFT:
      x -= step;
      break;
  }

  return {
    x: x,
    y: y
  };
}
