var CONFIG = {
  WORLD: {
    WIDTH: 640,
    HEIGHT: 480
  },
  PLAYER: {
    SIZE: 10
  },
  TICK_TIME: 100,
  DIRECTION: {
    NOT_MOVING: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
  },
  COUNTDOWN_SECS: 3,
  DIRECTLY_JOIN_GAME: true,   // Directly join current game when connected
  DIRECTLY_LEAVE_GAME: true
};

module.exports = CONFIG;