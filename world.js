
function World(width, height, tileSize) {
	this.width = width;
	this.height = height;
	this.paused = true;
  if(width % tileSize != 0 ) {
    throw("ERROR: WORLD.WIDTH should be a multiple of tileSize");
  }
  if(height % tileSize != 0 ) {
    throw("ERROR: WORLD.HEIGHT should be a multiple of tileSize");
  }
	this.tileSize = tileSize;
	
	this.players = {};

	this.tiles_width = width / tileSize;
	this.tiles_height = height / tileSize;

	this.grid = new Array([this.tiles_width]); 

	// init empty grid
	for(var x = 0; x < this.tiles_width; x++) {
		this.grid[x] = new Array([this.tiles_height]);
		for(var y = 0; y < this.tiles_height; y++) {
			this.grid[x][y] = null;
		}
	}

}


World.prototype.movePlayers = function(player) {
	if(!this.paused) {
		for (var id in this.players) {
			var p = this.players[id];
			if(!p.isAlive()) {
				continue;
			}
			p.move();
			if(p.x < 0 || p.y < 0 || p.x >= this.grid.length || p.y >= this.grid[p.x].length) {
				// Player collide with wall!
				p.die();
			} else if(this.grid[p.x][p.y] != null){
				// Someone was already here
				p.die();
			} else {
				// Set player to new position on grid
				this.grid[p.x][p.y] = p.color;
			}
		}
	}
}

World.prototype.addPlayer = function(player) {
	player.direction = 3; //  + (this.getTotalPlayers() % 3);
  player.x = Math.floor((Math.random() * 10 * this.tiles_width) % this.tiles_width);
  player.y = Math.floor((Math.random() * 10 * this.tiles_height) % this.tiles_height);

  console.log("New player @", player.x, player.y);
  this.grid[player.x][player.y] = player.color;
  this.players[player.id] = player;
}

World.prototype.getTotalPlayers = function(player) {
	return Object.keys(this.players).length;
}

World.prototype.togglePause = function() {
	this.paused = !this.paused;
}

World.prototype.removePlayer = function(player_id) {
	delete this.players[player_id];
}


function addRandomPlayer() {
  var player = new Player(uuid.v4(), getNiceColor(), C.PLAYER.SIZE);
  addPlayer(player);
}


module.exports = World;