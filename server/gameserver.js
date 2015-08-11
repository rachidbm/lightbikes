"use strict";

var Uuid = require('uuid');
var util = require('util');
// var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var C = require("./config");
var World = require("./world.js");
var Player = require("./player.js");


Game.prototype.__proto__ = EventEmitter.prototype; // extends  EventEmitter

function Game() {
  this.world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT, C.PLAYER.SIZE);
  this.countingDown = false;
  this.players = {};
}


Game.prototype.update = function() {
	if(this.countingDown || this.world.getTotalPlayers() < 1) {
    return;
  }
	this.world.update();

  if(this.world.allPlayersDied()) {
    this.restart();
  } else {
    this.countingDown = false;
    this.emit('update', {
      totalPlayers: this.world.getTotalPlayers(),
      world: this.world
    });
  }
};


Game.prototype.createPlayer = function() {
  var player = new Player(Uuid.v4(), getNextColor(), this.tileSize);
  this.players[player.id] = player;
  if(this.getTotalPlayers() < 2) {
    this.restart();
  }else if(C.DIRECTLY_JOIN_GAME) {
    this.world.addPlayer(player);
  }
  return player;
};


Game.prototype.removePlayer = function(player_id) {
  if(C.DIRECTLY_LEAVE_GAME) {
    this.world.removePlayer(player_id);
  }
  delete this.players[player_id];
};


Game.prototype.playerMoved = function(playerId, newDirection) {
    var p = this.players[playerId];
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


Game.prototype.restart = function() {
  if(this.countingDown) {
    return;
  }
  this.startNewGame(3);
};


Game.prototype.startNewGame = function(seconds) {
  var id;
  this.world = new World(C.WORLD.WIDTH, C.WORLD.HEIGHT, C.PLAYER.SIZE);
  this.world.paused = true;
  for (id in this.players) {
    this.players[id].alive = true;
    this.world.addPlayer(this.players[id]);
  }

  this.emit('restart', {
    world: this.world
  });

  this.startAfterCountdown(seconds);
};


Game.prototype.startAfterCountdown = function(seconds) {
  this.countingDown = true;
  var _this = this;
  var intervalId = setInterval(function() {
     if(seconds > 0) {
        _this.emit('countdown', {
          seconds: seconds
        });
        seconds -= 1;
      } else {
        _this.emit('countdown', {
          seconds: 'GO'
        });
        clearInterval(intervalId);
        _this.countingDown = false;
        // Start the game!
        _this.emit('started');
        _this.world.pause(false);
      }   
  }, 1000);
};


Game.prototype.getTotalPlayers = function() {
  return Object.keys(this.players).length;
};


var COLORS = [
  '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a',
  '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2',
  '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
  '#e21400', '#91580f', '#f8a700', '#f78b00', '#58dc00', '#287b00',
  '#a8f07a', '#4ae8c4', '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
var currentColorIndex = 0;

function getNextColor() {
  currentColorIndex++;
  return COLORS[currentColorIndex % COLORS.length];
}


module.exports = Game;