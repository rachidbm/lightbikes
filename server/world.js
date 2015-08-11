"use strict";

var Uuid = require('uuid');
var Player = require("./player.js");


function World(width, height, tileSize) {
	this.width = width;
	this.height = height;
	this.tileSize = tileSize;
	this.paused = true;
	if (width % tileSize !== 0) {
		throw ("ERROR: WORLD.WIDTH should be a multiple of tileSize");
	}
	if (height % tileSize !== 0) {
		throw ("ERROR: WORLD.HEIGHT should be a multiple of tileSize");
	}
	this.players = {};

	this.tiles_width = width / tileSize;
	this.tiles_height = height / tileSize;

	this.grid = new Array([this.tiles_width]);

	this.resetGrid();
}

World.prototype.resetGrid = function() {
	var x, y;
	for (x = 0; x < this.tiles_width; x++) {
		this.grid[x] = new Array([this.tiles_height]);
		for (y = 0; y < this.tiles_height; y++) {
			this.grid[x][y] = null;
		}
	}
	console.log("Created new grid of", this.tiles_width, "x", this.tiles_height, "tiles");
};


World.prototype.allPlayersDied = function() {
	var id, p, playerAlive = null;
	for (id in this.players) {
		p = this.players[id];
		if (p.alive) {
			playerAlive = p;
			break;
		}
	}
	return playerAlive === null;
};

World.prototype.update = function() {
	if (this.paused) {
		return;
	}
	var id, p, nextPos;

	for (id in this.players) {
		p = this.players[id];
		if (!p.alive) {
			continue;
		}
		nextPos = p.calcNextPosition();
		if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= this.grid.length || nextPos.y >= this.grid[nextPos.x].length) {
			// Player collide with wall!
			p.die();
			if (this.allPlayersDied()) {
				return;
			}
		} else if (this.grid[nextPos.x][nextPos.y] !== null) {
			// Someone was already here
			p.die();
			if (this.allPlayersDied()) {
				return;
			}
		} else {
			// Set player to new position on grid
			p.setPostion(nextPos.x, nextPos.y);
			this.grid[nextPos.x][nextPos.y] = p.color;
		}
	}
};


World.prototype.addPlayer = function(player) {
	// Initial direction is random
	player.direction = Math.floor((Math.random() * 4)) + 1;
	var position = this.randomEmptyPosition();
	if (position !== null) {
		player.x = position.x;
		player.y = position.y;
		this.grid[player.x][player.y] = player.color;
		this.players[player.id] = player;
	}
};


World.prototype.randomEmptyPosition = function() {
	var x, y;
	var attemptsLeft = this.tiles_width * this.tiles_height;
	while (true) {
		if (attemptsLeft < 1) {
			console.log("Player can not be added. World is over crowded! ");
			break;
		}
		x = Math.floor(Math.random() * this.tiles_width);
		y = Math.floor(Math.random() * this.tiles_height);
		if (this.grid[x][y] !== null) {
			// This spot is already taken, try again...
			attemptsLeft--;
			continue;
		} else {
			return {
				x: x,
				y: y
			};
		}
	}
	return null;
};


World.prototype.getTotalPlayers = function() {
	return Object.keys(this.players).length;
};


World.prototype.togglePause = function() {
	this.paused = !this.paused;
};


World.prototype.pause = function(paused) {
	this.paused = paused;
};


World.prototype.removePlayer = function(player_id) {
	delete this.players[player_id];
};


module.exports = World;