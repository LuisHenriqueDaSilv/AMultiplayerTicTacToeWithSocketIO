import {createContext} from 'react'

const GameContext = createContext({})

export default GameContext

export function GameContextProvider({children}:any) {

    return(
        <GameContext.Provider
            value
        >
            {children}
        </GameContext.Provider>
    )
}