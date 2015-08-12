"use strict";


function GameHistory(gameserver) {
	this.gameserver = gameserver;
	this.games = {};
	var _this = this;

  this.gameserver.on('started', function gameStarted(gameId) { 
  	var currentTime = new Date().toJSON();
    // console.log('[GameHistory] - STARTED ', gameId);
    _this.games[gameId] = {started: currentTime};
    // console.log(Object.keys(_this.games).length, ' games in memory: ', _this.games);
    console.log(Object.keys(_this.games).length + ' games in memory');
  });

  this.gameserver.on('finished', function(gameId) { 
    // console.log('[GameHistory] - FINISHED ', gameId);
    _this.endGame(gameId.gameId);
  });

  this.gameserver.on('aborted', function(gameId) { 
    // console.log('[GameHistory] - ABORTED ', gameId);
    _this.endGame(gameId.gameId);
  });
}


GameHistory.prototype.endGame = function(gameId) {
  if(this.games[gameId] === undefined) {
    return; // Game was not started! 
  }
  this.games[gameId].ended = new Date().toJSON();
  // console.log('[GameHistory] - endGame: ',gameId, game);
};


module.exports = GameHistory;