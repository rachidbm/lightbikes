
function Player(id, color, size, x, y) {
	this.id = id;
    this.color = color;
	this.size = size;
	this.x = x;
	this.y = y;
	this.direction = 0;
}

Player.prototype.left = function() { 
	console.log(id + " goes left");
	// this.direction - 1 % 4;
};

Player.prototype.right = function() { 
	console.log(id + " goes right");
	// this.direction  + 1 % 4;
};

Player.prototype.getColor = function() { 
	return this.color; 
};


module.exports = Player;
