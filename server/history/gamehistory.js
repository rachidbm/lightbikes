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

  this.gameserver.on('finished', function(gameId, winnerId) { 
    console.log('Game', gameId, 'is won by', winnerId);
  });

  this.gameserver.on('aborted', function(gameId) { 
    console.log('Game', gameId, 'is aborted');
  });

}



module.exports = GameHistory;