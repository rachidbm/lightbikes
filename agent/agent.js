module.exports = Agent;

var C = require("../config");


function Agent(id, directionChangedCallback) {
  this.id = id;
  this.tickCounter = 0;
  this.actionSpeed = 1; // Every 'x' ticks this Agent does something
  this.directionChangedCallback = directionChangedCallback;
}

Agent.prototype.tick = function(world) { 
  this.tickCounter++;
  if(this.tickCounter % this.actionSpeed != 0) {
    return;
  }

  var player = world.players[this.id];
  if(!player.alive) {
    return;
  }
  var currentDirection = player.direction;

  var newDirection = this.calcNextDirection(world, player);

  if(currentDirection != newDirection) {
    console.log("change direction from", currentDirection, "to", newDirection);
    this.directionChangedCallback(newDirection);
  }
}

Agent.prototype.calcNextDirection = function(world, player) { 
  var nextPos = calcNextPosition(player);
  // console.log("Calc next Direction, next position: ", nextPos);
  if(nextPos.x <= 0) {
    // move up or down
    return C.DIRECTION.UP;
  } else if(nextPos.y <= 0) {
    return C.DIRECTION.RIGHT;
  } else if(nextPos.x >= world.grid.length-1) {
    return C.DIRECTION.DOWN;
  } else if(nextPos.y >= world.grid[nextPos.x].length-1) {
    return C.DIRECTION.LEFT;
  }
    // p.x >= this.grid.length || p.y >= this.grid[p.x].length) {
  return player.direction;
}


function calcNextPosition(player) {

  var x = player.x, y = player.y;
  // var step = this.size;
  var step = 1;
  switch(player.direction) {
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
  }
}