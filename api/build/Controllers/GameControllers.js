"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Utils
var GenerateEmptyGamedata_1 = __importDefault(require("../Utils/GenerateEmptyGamedata"));
var GameControllers = /** @class */ (function () {
    function GameControllers(socketClient) {
        var _this = this;
        this.rank = {
            first: {
                id: null,
                username: 'N/A',
                wins: 0
            },
            second: {
                id: null,
                username: 'N/A',
                wins: 0
            }
        };
        this.matchs = [];
        this.players = [];
        this.hasWinner = function (match) {
            var gamedata = match.gamedata;
            var winnerPositions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ]; //Positions that if equal, a player won
            var winner = false;
            var positions = false;
            winnerPositions.map(function (positions_) {
                if (gamedata[positions_[0]].value === gamedata[positions_[1]].value &&
                    gamedata[positions_[1]].value === gamedata[positions_[2]].value &&
                    gamedata[positions_[1]].value !== 'empty') {
                    var winnerSymbol_1 = gamedata[positions_[1]].value;
                    var winnerPlayer = match.players.filter(function (player) {
                        return player.symbol === winnerSymbol_1;
                    })[0];
                    winner = winnerPlayer.id;
                    positions = positions_;
                }
            });
            if (winner) {
                _this.addNewWinAPlayer(winner);
                _this.socketClient.to(match.roomId).emit('endMatch', {
                    win: true,
                    tie: false,
                    winner: winner,
                    positions: positions
                });
                var matchIndexInMatchsData = _this.matchs.indexOf(match);
                var newGamedata = {
                    roomId: match.roomId,
                    gamedata: GenerateEmptyGamedata_1.default(),
                    inPlaying: match.inPlaying,
                    players: match.players,
                };
                _this.matchs[matchIndexInMatchsData] = newGamedata;
                return _this.socketClient.to(match.roomId).emit('changeGamedata', newGamedata);
            }
            var emptyHouses = match.gamedata.map(function (house) {
                return house.value === 'empty';
            });
            if (emptyHouses.length === 0) {
                var matchIndexInMatchsData = _this.matchs.indexOf(match);
                _this.socketClient.to(match.roomId).emit('endMatch', {
                    win: false,
                    tie: true,
                    winner: null,
                    positions: null
                });
                var newGamedata = {
                    roomId: match.roomId,
                    gamedata: GenerateEmptyGamedata_1.default(),
                    inPlaying: match.inPlaying,
                    players: match.players,
                };
                _this.matchs[matchIndexInMatchsData] = newGamedata;
                return _this.socketClient.to(match.roomId).emit('changeGamedata', newGamedata);
            }
        };
        this.handleNewConnection = function (socket) {
            var playerId = socket.id;
            var playerName = socket.handshake.query.nickname;
            if (!playerName) {
                return;
            }
            socket.emit('rank', _this.rank);
            _this.players.push({
                userid: playerId,
                wins: 0,
                username: playerName
            });
            var matchsAwaitingPlayers = _this.matchs.filter(function (match) {
                return match.players.length == 1;
            });
            if (matchsAwaitingPlayers.length > 0) { //Has one or more matches with only one player
                var matchAwaitingPlayersIndex = _this.matchs.indexOf(matchsAwaitingPlayers[0]);
                _this.matchs[matchAwaitingPlayersIndex].players.push({
                    id: playerId,
                    symbol: 'X',
                    username: playerName
                });
                socket.join(_this.matchs[matchAwaitingPlayersIndex].roomId);
                _this.socketClient.to(_this.matchs[matchAwaitingPlayersIndex].roomId).emit('changeGamedata', _this.matchs[matchAwaitingPlayersIndex]);
            }
            else {
                var matchId = _this.matchs.length > 0 ? _this.matchs[_this.matchs.length - 1].roomId + 1 : 1;
                var newMatchData = {
                    gamedata: GenerateEmptyGamedata_1.default(),
                    inPlaying: playerId,
                    players: [
                        {
                            id: playerId,
                            username: playerName,
                            symbol: 'O'
                        }
                    ],
                    roomId: matchId
                };
                _this.matchs.push(newMatchData);
                socket.join(matchId);
                _this.socketClient.to(matchId).emit('changeGamedata', newMatchData);
            }
            socket.on('disconnect', function () {
                _this.handleDesconnect(socket);
            });
            socket.on('move', function (data) {
                _this.handleMove(data, socket);
            });
        };
        this.addNewWinAPlayer = function (winnerId) {
            if (!winnerId) {
                return;
            }
            var winnerPlayerInPlayers = _this.players.filter(function (player) {
                return player.userid === winnerId;
            });
            var winnerPlayerIndexInPlayers = _this.players.indexOf(winnerPlayerInPlayers[0]);
            _this.players[winnerPlayerIndexInPlayers].wins = _this.players[winnerPlayerIndexInPlayers].wins + 1;
            if (_this.players[winnerPlayerIndexInPlayers].wins >= _this.rank.second.wins) {
                _this.rank.second.id = winnerId;
                _this.rank.second.username = winnerPlayerInPlayers[0].username;
                _this.rank.second.wins = _this.players[winnerPlayerIndexInPlayers].wins;
                if (_this.rank.first.wins < _this.rank.second.wins) {
                    var latestFirst = __assign({}, _this.rank.first);
                    var latestSecond = __assign({}, _this.rank.second);
                    _this.rank.first = latestSecond;
                    _this.rank.second = latestFirst;
                }
                _this.socketClient.emit('rank', _this.rank);
            }
        };
        this.handleDesconnect = function (socket) {
            var desconnectedPlayerId = socket.id;
            var desconnectedPlayerName = socket.handshake.query.nickname;
            if (!desconnectedPlayerName) {
                return;
            }
            var matchsWithDesconnectedPlayer = _this.matchs.filter(function (match) {
                return match.players.filter(function (player) {
                    player.id === desconnectedPlayerId;
                });
            });
            var desconnectedPlayerInPlayers = _this.players.filter(function (player) {
                return player.userid === desconnectedPlayerId;
            });
            if (desconnectedPlayerInPlayers.length === 0) {
                return;
            }
            var deconnectedPlayerIndex = _this.players.indexOf(desconnectedPlayerInPlayers[0]);
            _this.players.splice(deconnectedPlayerIndex, 1);
            if (matchsWithDesconnectedPlayer.length > 0) {
                var match = matchsWithDesconnectedPlayer[0];
                var matchIndexInMatchsIndex = _this.matchs.indexOf(match);
                if (match.players.length === 1) {
                    return _this.matchs.splice(matchIndexInMatchsIndex, 1);
                }
                else {
                    var winner = match.players.filter(function (player) {
                        return player.id !== desconnectedPlayerId;
                    })[0];
                    _this.addNewWinAPlayer(winner === null || winner === void 0 ? void 0 : winner.id);
                    _this.socketClient.to(match.roomId).emit('win', {
                        winnerId: winner === null || winner === void 0 ? void 0 : winner.id
                    });
                    _this.matchs.splice(matchIndexInMatchsIndex, 1);
                    var matchsAwaitingPlayers = _this.matchs.filter(function (match) {
                        return match.players.length == 1;
                    });
                    if (matchsAwaitingPlayers.length > 0) { //Has one or more matches with only one player
                        var matchAwaitingPlayersIndex = _this.matchs.indexOf(matchsAwaitingPlayers[0]);
                        _this.matchs[matchAwaitingPlayersIndex].players.push({
                            id: winner.id,
                            symbol: 'X',
                            username: winner.username
                        });
                        socket.join(_this.matchs[matchAwaitingPlayersIndex].roomId);
                        _this.socketClient.to(_this.matchs[matchAwaitingPlayersIndex].roomId).emit('changeGamedata', _this.matchs[matchAwaitingPlayersIndex]);
                    }
                    else {
                        var matchId = _this.matchs.length > 0 ? _this.matchs[_this.matchs.length - 1].roomId + 1 : 1;
                        var newMatchData = {
                            gamedata: GenerateEmptyGamedata_1.default(),
                            inPlaying: winner === null || winner === void 0 ? void 0 : winner.id,
                            players: [
                                {
                                    id: winner.id,
                                    username: winner.username,
                                    symbol: 'O'
                                }
                            ],
                            roomId: matchId
                        };
                        socket.join(matchId);
                        _this.socketClient.to(matchId).emit('changeGamedata', newMatchData);
                        _this.matchs.push(newMatchData);
                    }
                }
            }
            else {
                return;
            }
        };
        this.handleMove = function (data, socket) {
            if (!data.index && data.index !== 0) {
                return;
            }
            var movePlayerId = socket.id;
            var movePlayerName = socket.handshake.query.nickname;
            if (!movePlayerName) {
                return;
            }
            var matchsWithMovePlayer = _this.matchs.filter(function (match) {
                return match.players.filter(function (player) {
                    player.id === movePlayerName;
                });
            });
            if (matchsWithMovePlayer.length > 0) {
                var match = matchsWithMovePlayer[0];
                if (match.players.length > 1) {
                    if (match.inPlaying === movePlayerId) {
                        if (match.gamedata[data.index].value === 'empty') {
                            var matchIndexInMatchsData = _this.matchs.indexOf(match);
                            var playerInMatch = match.players.filter(function (player) {
                                return player.id === movePlayerId;
                            })[0];
                            _this.matchs[matchIndexInMatchsData].gamedata[data.index].value = playerInMatch.symbol;
                            _this.matchs[matchIndexInMatchsData].inPlaying =
                                match.inPlaying === match.players[0].id ? match.players[1].id : match.players[0].id;
                            _this.socketClient.to(match.roomId).emit('changeGamedata', _this.matchs[matchIndexInMatchsData]);
                            _this.hasWinner(_this.matchs[matchIndexInMatchsData]);
                        }
                    }
                }
            }
            return;
        };
        this.socketClient = socketClient;
    }
    return GameControllers;
}());
exports.default = GameControllers;
