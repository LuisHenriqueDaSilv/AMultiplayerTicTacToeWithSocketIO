"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socketIo = require('socket.io');
require('dotenv/config');
//Controllers import
var GameControllers_1 = __importDefault(require("./Controllers/GameControllers"));
var expressApp = express_1.default();
var httpServer = http_1.default.createServer(expressApp);
var socketClient = socketIo(httpServer);
var _a = new GameControllers_1.default(socketClient), handleNewConnection = _a.handleNewConnection, matchs = _a.matchs, rank = _a.rank;
socketClient.on('connection', handleNewConnection);
var port = process.env.port || 3003;
httpServer.listen(port, function () {
    console.log("Server listening on port: 3003");
});
