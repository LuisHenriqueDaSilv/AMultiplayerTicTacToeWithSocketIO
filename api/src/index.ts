import express from 'express'
import http from 'http'
const socketIo = require('socket.io')
require('dotenv/config')

//Controllers import
import GameControllers from './Controllers/GameControllers'


const expressApp = express()
const httpServer = http.createServer(expressApp)
const socketClient = socketIo(httpServer)

const {handleNewConnection} = new GameControllers(socketClient)

socketClient.on('connection', handleNewConnection)

const port = process.env.PORT || 3003

httpServer.listen(port, () => {
    console.log(`Server listening on port: 3003`)
})