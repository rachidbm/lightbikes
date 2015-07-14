function Player(id, color, size, x, y) {
	this.id = id;
    this.color = color;
	this.size = size;
	this.x = x;
	this.y = y;
}

Player.prototype.getColor = function() { 
	return this.color; 
};


module.exports = Player;
