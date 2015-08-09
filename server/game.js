// TOOD start/restartGame a game, tracks players alive, determine winner, trigger countdown...

module.exports = Game;

var Uuid = require('uuid');
var Player = require("./player.js");


function Game() {
}

World.prototype.resetGrid = function() {
	console.log("Reset Grid");
	for (var x = 0; x < this.tiles_width; x++)