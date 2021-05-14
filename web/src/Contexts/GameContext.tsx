import {createContext} from 'react'
import socketIoClient from 'socket.io-client'


const GameContext = createContext({})

export default GameContext

export function GameContextProvider({children}:any) {

    const socket = socketIoClient.connect('http://localhost:3030')

    socket.emit('teste')
    socket.on('reponse', (response:any) => {
        alert(response)
    })

    return(
        <GameContext.Provider
            value
        >
            {children}
        </GameContext.Provider>
    )
}