import http from 'http'
import socketIo from 'socket.io'
import express from 'express'
import 'dotenv/config'

const app = express()
const httpServer = http.createServer(app)

const io = socketIo(httpServer)
app.set('io', io)

const port = process.env.PORT?? 3030
httpServer.listen(port, () => {
    console.log(`listen on ${port}`)
})

io.on('connection', (connection) => {
    connection.on('teste', () => {
        console.log('teste')
    })
})