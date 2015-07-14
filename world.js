
function World(width, height) {
	this.width = width;
	this.height = height;
	this.players = {};
	this.pause = true;
}


World.prototype.movePlayers = function(player) {
	if(!this.pause) {
		for (var id in this.players) {
			this.players[id].move();
		}
	}
}

World.prototype.addPlayerToBoard = function(player) {
  var pos = Object.keys(this.players).length * 20 + 30;
  //getTotalPlayers()
  player.x = pos;
  player.y = pos;
  player.direction = 1 + (this.getTotalPlayers() % 3);
  //console .log("Place player on the board", player);
  this.players[player.id] = player;
  //++nrOfPlayers;
}

World.prototype.getTotalPlayers = function(player) {
	return Object.keys(this.players).length;
}

World.prototype.togglePause = function() {
	this.pause = !this.pause;
}

World.prototype.removePlayer = function(player_id) {
	delete this.players[player_id];
}




function addRandomPlayer() {
  var player = new Player(uuid.v4(), getNiceColor(), C.PLAYER.SIZE);
  addPlayerToBoard(player);
}


module.exports = World;