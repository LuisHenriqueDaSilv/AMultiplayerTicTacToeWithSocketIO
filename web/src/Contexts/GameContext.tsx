import {createContext, useEffect, useState} from 'react'

//Utils
import generateEmptyGamedata from '../Utils/GenerateEmptyGamedata'
import gerenateEmptyRank from '../Utils/GerenateEmptyRank'

//Types
import {ContextDataInterface, GameDataInterface, RankInterface} from '../Types/GameContextTypes'
import generateEmptyRank from '../Utils/GerenateEmptyRank'

const GameContext = createContext({} as ContextDataInterface)

export default GameContext

export function GameContextProvider({children}:any) {

    const [crossName, setCrossName] = useState<string>('')
    const [circleName, setCircleName] = useState<string>('')
    const [rank, setRank] = useState<RankInterface>(gerenateEmptyRank() as RankInterface)
    const [gamedata, setGamedata] = useState<[GameDataInterface]>(generateEmptyGamedata() as [GameDataInterface])
    const [playing, setPlaying] = useState<'O'|'X'>('O')

    useEffect(() => {
        const hasWinnerResponse = hasWinner()

        if(hasWinnerResponse.winner){
            alert(`we have winner! ${hasWinnerResponse.winner}.`)

            const newRank = {...rank}

            if(newRank.first.symbol === 'N/A'){
                newRank.first.symbol = 'O'
                newRank.first.username = circleName
                newRank.second.symbol = 'X'
                newRank.second.username = crossName
            }

            if(newRank.first.symbol === hasWinnerResponse.winner){
                newRank.first.wins = newRank.first.wins + 1
            }else{
                newRank.second.wins = newRank.second.wins + 1
            }

            if(newRank.second.wins > newRank.first.wins){
                const lastFirst = {...newRank.first}
                const lastSecond = {...newRank.second}
                newRank.second = lastFirst
                newRank.first = lastSecond 
            }

            setRank(newRank)
            return restartMatch(true)
        }else{

            const emptyHouses = gamedata.filter((data) => {
                return data.value === 'empty'
            })
    
            if(emptyHouses.length === 0){
                alert(`we have a tie!`)
                return restartMatch(true)
            }
        }

    }, [gamedata]) 

    const hasWinner = () => {

        const winnerPositions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ] //Positions that if equal, a player won

        let winner:any = false
        let positions:any = false

        winnerPositions.map(positions_ => {
            if(
                gamedata[positions_[0]].value === gamedata[positions_[1]].value &&
                gamedata[positions_[1]].value === gamedata[positions_[2]].value &&
                gamedata[positions_[1]].value !=='empty'
            ){
                winner = gamedata[positions_[1]].value
                positions = positions_
            }
        })

        return {winner, positions }

    }

    const restartMatch = (bypass?:boolean) => {
        if(bypass||window.confirm('Restart match?')){
            setGamedata(generateEmptyGamedata() as [GameDataInterface])
        }

        return
    }

    const resetScore = () => {
        if(window.confirm('Reset score?')){
            setCircleName('')
            setCrossName('')
            setGamedata(generateEmptyGamedata() as [GameDataInterface])
            setRank(generateEmptyRank() as RankInterface)
        }
        return
    }

    const addNickname = (symbol:'X'|'O', nickname:string) => {
        if(!nickname){
            return
        }

        if(symbol ==='X'){
            return setCrossName(nickname)
        }else if(symbol ==='O'){
            return setCircleName(nickname)
        }
    }

    const handleMove = (movePosition:number) => {

        if(!crossName || !circleName){
            return alert('You need add nickname for all players!')
        }

        if(gamedata[movePosition].value !== 'empty'){
            return
        }

        const newGameData = [...gamedata]
        newGameData[movePosition].value = playing

        setPlaying(playing === 'O'? 'X':'O')

        return setGamedata(newGameData as [GameDataInterface])
        

    }

    return(
        <GameContext.Provider
            value={{
                gamedata,
                playing,
                crossName, 
                circleName,
                rank,
                handleMove,
                resetScore,
                restartMatch,
                addNickname
            }}
        >
            {children}
        </GameContext.Provider>
    )
}