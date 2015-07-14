var DIRECTION = {
	NOT_MOVING: 0,
	UP: 1,
	RIGHT: 2,
	DOWN: 3,
	LEFT: 4
}

function Player(id, color, size, x, y) {
	this.id = id;
  this.color = color;
	this.size = size;
	this.x = x;
	this.y = y;
	this.direction = 0;
}

Player.prototype.up = function() { 
	if(this.direction != DIRECTION.DOWN) {
		this.direction = DIRECTION.UP;
	}
};

Player.prototype.right = function() { 
	if(this.direction != DIRECTION.LEFT) {
		this.direction = DIRECTION.RIGHT;
	}
};

Player.prototype.down = function() { 
	if(this.direction != DIRECTION.UP) {
		this.direction = DIRECTION.DOWN;
	}
};

Player.prototype.left = function() { 
	if(this.direction != DIRECTION.RIGHT) {
		this.direction = DIRECTION.LEFT;
	}
};

Player.prototype.changeDirection = function() { 
	changeDirection
}


Player.prototype.move = function() { 
	var step = this.size/2;
	switch(this.direction) {
	case DIRECTION.UP:
		this.y -= step;
	    break;
	case DIRECTION.RIGHT:
		this.x += step;
	    break;
	case DIRECTION.DOWN:
		this.y += step;
	    break;
	case DIRECTION.LEFT:
		this.x -= step;
	    break;
	}	
};


module.exports = Player;
