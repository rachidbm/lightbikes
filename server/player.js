module.exports = Player;

var C = require("./config");

function Player(id, color, size, x, y) {
	this.id = id;
	this.color = color;
	this.size = size;
	this.x = x;
	this.y = y;
	this.direction = 0;
	this.alive = true;
}

Player.prototype.die = function() {
	this.alive = false;
};

Player.prototype.up = function() {
	if (this.direction != C.DIRECTION.DOWN) {
		this.direction = C.DIRECTION.UP;
	}
};

Player.prototype.right = function() {
	if (this.direction != C.DIRECTION.LEFT) {
		this.direction = C.DIRECTION.RIGHT;
	}
};

Player.prototype.down = function() {
	if (this.direction != C.DIRECTION.UP) {
		this.direction = C.DIRECTION.DOWN;
	}
};

Player.prototype.left = function() {
	if (this.direction != C.DIRECTION.RIGHT) {
		this.direction = C.DIRECTION.LEFT;
	}
};

Player.prototype.setPostion = function(x, y) {
	if (!this.alive) {
		return;
	}
	this.x = x;
	this.y = y;
};

Player.prototype.calcNextPosition = function() {
  var x = this.x,
		y = this.y;

  var step = 1;
  switch (this.direction) {
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
  };
};
