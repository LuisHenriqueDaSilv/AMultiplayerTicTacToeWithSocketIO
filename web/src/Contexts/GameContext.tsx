import {createContext, useEffect, useState} from 'react'
import socketIo from 'socket.io-client'

//Utils
import generateEmptyGamedata from '../Utils/GenerateEmptyGamedata'
import gerenateEmptyRank from '../Utils/GerenateEmptyRank'

//Types
import {
    ContextDataInterface,
    GameDataInterface,
    RankInterface,
    onlineMatchInterface,
    gameEndDataInterface
} from '../Types/GameContextTypes'

//Utils
import generateEmptyRank from '../Utils/GerenateEmptyRank'

const GameContext = createContext({} as ContextDataInterface)

export default GameContext

let socketIoClient:any

export function GameContextProvider({children}:any) { 

    const [onlineName, setOnlineName] = useState<string>('')
    const [crossName, setCrossName] = useState<string>('')
    const [circleName, setCircleName] = useState<string>('')
    const [rank, setRank] = useState<RankInterface>(gerenateEmptyRank() as RankInterface)
    const [gamedata, setGamedata] = useState<[GameDataInterface]>(generateEmptyGamedata() as [GameDataInterface])
    const [playing, setPlaying] = useState<'O'|'X'>('O')
    const [winPositions, setWinPositions] = useState<number[]|null>([])
    const [gamemode, setGamemode] = useState<'multiplayer'| 'local'>('local')
    const [itsMyTurn, setItsMyTurn] = useState<boolean>(false)
    const [areAwaitingplayer, setAreAwaitingplayer] = useState<boolean>(false)
    const [mySymbol, setMySymbol] = useState<'X'|'O'>('O')

    const [matchData, setMatchData] = useState<onlineMatchInterface>()
    

    useEffect(() => {

        resetScore(true)
        if(gamemode === 'local'){
            if(socketIoClient){
                socketIoClient.disconnect()
            }
        }

    }, [gamemode])

    useEffect(() => {
        
        if(gamemode === 'local'){
            return
        }

        if(onlineName){

            socketIoClient = socketIo.connect('https://tictactoeapii.herokuapp.com/', {query: {nickname: onlineName}})

            socketIoClient.on('rank', (rank:RankInterface) => {
                setRank(rank)
            })

            socketIoClient.on('changeGamedata', (matchData:onlineMatchInterface) => {

                const myInMatch = matchData.players.filter((player)=> {

                    if(player.id === matchData.inPlaying){
                        setPlaying(player.symbol)
                    }

                    if(player.symbol === 'X'){
                        setCrossName(player.username)
                    }else if(player.symbol === 'O'){
                        setCircleName(player.username)
                    }
                    
                    return player.id === socketIoClient.id 
                })[0]

                

                setMySymbol(myInMatch.symbol)

                setMatchData(matchData)

                if(matchData.inPlaying === socketIoClient.id){
                    setItsMyTurn(true)
                }else{
                    setItsMyTurn(false)
                }

                if(matchData.players.length  === 1){
                    return setAreAwaitingplayer(true)

                }else{
                    setAreAwaitingplayer(false)
                    return setGamedata(matchData.gamedata)
                }
                
            })

            socketIoClient.on('endMatch', (data: gameEndDataInterface) => {

                if(data.win){

                    const winnerPlayer = matchData?.players.filter((player) => {
                        return player.id === data.winner
                    })[0]

                    alert(`We have a winner! ${data.winner === socketIoClient.id? 'You':'Your opponent'}`)
                }

                if(data.tie){
                    alert(`We have a tie!`)
                }
            })

        }

    }, [onlineName])

    useEffect(() => {

        if(gamemode === 'multiplayer'){
            return
        }else {

            const hasWinnerResponse = hasWinner()
    
            if(hasWinnerResponse.winner){
    
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
    
                setWinPositions(hasWinnerResponse.positions)
                
                setTimeout(() => {
                    alert(`we have winner! ${hasWinnerResponse.winner}.`)
                    setWinPositions(null)
                    return restartMatch(true)
                }, 300)
    
    
                 
            }else{
    
                const emptyHouses = gamedata.filter((data) => {
                    return data.value === 'empty'
                })
        
                if(emptyHouses.length === 0){
                    alert(`we have a tie!`)
                    return restartMatch(true)
                }
            }
        }

    }, [gamedata]) 


    const changeGamemode = (gamemode:'multiplayer'| 'local') => {
        setGamemode(gamemode)
    }

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

    const resetScore = (bypass?:boolean) => {
        if(bypass || window.confirm('Reset score?')){
            setAreAwaitingplayer(false)
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

        if(gamemode === 'multiplayer'){
            return setOnlineName(nickname)
        }

        if(symbol ==='X'){
            return setCrossName(nickname)
        }else if(symbol ==='O'){
            return setCircleName(nickname)
        }
    }

    const handleMove = (movePosition:number) => {
        console.log(movePosition)

        if(gamemode === 'multiplayer' && circleName && !areAwaitingplayer){
            
            socketIoClient.emit('move', {index: movePosition})
            return

        }else{

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
                addNickname,
                winPositions,
                changeGamemode,
                gamemode,
                areAwaitingplayer,
                itsMyTurn,
                mySymbol
            }}
        >
            {children}
        </GameContext.Provider>
    )
}