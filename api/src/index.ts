import express from 'express'
import http from 'http'
const socketIo = require('socket.io')

//Controllers import
import GameControllers from './Controllers/GameControllers'


const expressApp = express()
const httpServer = http.createServer(expressApp)
const socketClient = socketIo(httpServer)

const {handleNewConnection, matchs, rank} = new GameControllers(socketClient)

socketClient.on('connection', handleNewConnection)

httpServer.listen(3003, () => {
    console.log(`Server listening on port: 3003`)
})

// setInterval(() => {
//     console.log(`======================================Matchs======================================`)
//     console.log(matchs)
//     console.log(`======================================Rank======================================`)
//     console.log(rank)
//     console.log('')
//     console.log('')
//     console.log('')
//     console.log('')
//     console.log('')
//     console.log('')
//     console.log('')
//     console.log('')

// }, 10000)