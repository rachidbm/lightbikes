module.exports = Game;

var Uuid = require('uuid');
var C = require("./config");
var World = require("./world.js");
var Player = require("./player.js");


function Game(io, onWorldRestart) {
	this.world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT, C.PLAYER.SIZE, onWorldRestart);
	this.countingDown = false;
	this.io = io;		// TODO Remove this.io
}

Game.prototype.update = function(player) {
	if(this.countingDown || this.world.getTotalPlayers() < 1) {
    return;
  }
	this.world.update();

  if(this.world.restartWhenAllPlayersDied()) {
    this.startNewGame(3);
  } else {
    this.countingDown = false;
    this.io.emit('render', {
      totalPlayers: this.world.getTotalPlayers(),
      world: this.world
    });
  }
};


Game.prototype.playerMoved = function(playerId, newDirection) {
    var p = this.world.players[playerId];
    switch (newDirection) {
      case C.DIRECTION.LEFT:
        p.left();
        break;
      case C.DIRECTION.UP:
        p.up();
        break;
      case C.DIRECTION.RIGHT:
        p.right();
        break;
      case C.DIRECTION.DOWN:
        p.down();
        break;
    }
};


Game.prototype.togglePause = function() {
	this.world.togglePause();
};


Game.prototype.startNewGame = function(seconds) {
  if(this.countingDown) {
    // Already starting a new Game.
    return;
  }
  this.world.restart();
  this.countingDown = true;
  var _this = this;
  var intervalId = setInterval(function() {
	   if(seconds > 0) {
	      // console.log('Start new game in:', seconds);
	      _this.io.emit('countdown', {
	        seconds: seconds
	      });
	      seconds--;
	    } else {
	      _this.io.emit('countdown', {
	        seconds: 'GO'
	      });
	      clearInterval(intervalId);
	      _this.countingDown = false;
	      // Start the game!
	      _this.world.pause(false);
	    }  	
  }, 1000);
};
