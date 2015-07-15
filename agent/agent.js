module.exports = Agent;

function Agent(id) {
  this.id = id;
  this.tickCounter = 0;
}

Agent.prototype.tick = function(world) { 
  this.tickCounter++;
  var moved = false;
  console.log("Calculate next step; ", this.id);
  if(moved) {
  // socket.emit("change direction", newDirection);
  }
  // var grid = world.grid;

}
