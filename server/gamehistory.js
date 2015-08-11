"use strict";


function GameHistory(gameserver) {
	this.gameserver = gameserver;
	this.games = {};
	var _this = this;

  this.gameserver.on('started', function gameStarted(gameId) { 
  	var currentTime = new Date().toJSON();
    console.log('[GameHistory] A new game is started with id;', gameId, 'at', currentTime );
    _this.games[gameId] = {started: currentTime};
    // console.log(Object.keys(_this.games).length, ' games in memory: ', _this.games);
    console.log(Object.keys(_this.games).length + ' games in memory');
  });

  this.gameserver.on('finished', function(winner) { 
    console.log('Game is won by', winner);
  });

}


GameHistory.prototype.update = function() {
}



module.exports = GameHistory;