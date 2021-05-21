"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var app = express_1.default();
var server = http_1.default.createServer(app);
var sockets = socket_io_1.default(server);
sockets.on('connection', function (socket) {
    var playerId = socket.id;
    console.log("> Player connected: " + playerId);
});
server.listen(3000, function () {
    console.log("> Server listening on port: 3000");
});
