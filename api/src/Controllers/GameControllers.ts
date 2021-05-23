//Types
import {rankInterface, matchInterface, handleMoveDataInterface, playerInterface } from '../Types/GameTypes' 

//Utils
import generateEmptyGamedata from '../Utils/GenerateEmptyGamedata'

class GameControllers{

    constructor(socketClient:any){
        this.socketClient = socketClient
    }

    socketClient

    rank = {
        first: {
            id: null,
            username: 'N/A',
            wins:0
        }, 
        second: {
            id: null,
            username: 'N/A',
            wins: 0
        }
    } as rankInterface

    matchs = [] as matchInterface[]

    players = [] as playerInterface[]

    hasWinner = (match:matchInterface) => {

        const gamedata = match.gamedata

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
                const winnerSymbol = gamedata[positions_[1]].value

                const winnerPlayer = match.players.filter((player) => {
                    return player.symbol === winnerSymbol
                })[0]

                winner = winnerPlayer.id

                positions = positions_
            }
        })

        if(winner){
            
            this.addNewWinAPlayer(winner)

            this.socketClient.to(match.roomId).emit('endMatch', {
                win: true,
                tie: false,
                winner,
                positions
            })

            const matchIndexInMatchsData = this.matchs.indexOf(match)

            const newGamedata = {
                roomId: match.roomId,
                gamedata: generateEmptyGamedata(),
                inPlaying: match.inPlaying,
                players: match.players,
            } as matchInterface

            this.matchs[matchIndexInMatchsData] = newGamedata

            return this.socketClient.to(match.roomId).emit('changeGamedata', newGamedata)

        }

        const emptyHouses = match.gamedata.filter((house) => {
            return house.value === 'empty'
        })

        if(emptyHouses.length === 0){

            const matchIndexInMatchsData = this.matchs.indexOf(match)

            this.socketClient.to(match.roomId).emit('endMatch', {
                win: false,
                tie: true,
                winner: null,
                positions: null
            })

            const newGamedata = {
                roomId: match.roomId,
                gamedata: generateEmptyGamedata(),
                inPlaying: match.inPlaying,
                players: match.players,
            } as matchInterface

            this.matchs[matchIndexInMatchsData] = newGamedata

            return this.socketClient.to(match.roomId).emit('changeGamedata', newGamedata)
        }


    }

    handleNewConnection = (socket:any) => {

        const playerId = socket.id
        const playerName = socket.handshake.query.nickname
    
        if(!playerName){
            return
        }


        this.players.push({
            userid: playerId,
            wins: 0,
            username: playerName
        })

        socket.emit('rank', this.rank)

        const matchsAwaitingPlayers = this.matchs.filter(match => {
            return match.players.length == 1
        })

        if(matchsAwaitingPlayers.length > 0){ //Has one or more matches with only one player
            
            const matchAwaitingPlayersIndex = this.matchs.indexOf(matchsAwaitingPlayers[0])

            this.matchs[matchAwaitingPlayersIndex].players.push({
                id: playerId,
                symbol: 'X',
                username: playerName
            })

            socket.join(this.matchs[matchAwaitingPlayersIndex].roomId)
            this.socketClient.to(this.matchs[matchAwaitingPlayersIndex].roomId).emit('changeGamedata', this.matchs[matchAwaitingPlayersIndex])


        }else{

            const newMatchId = this.matchs.length > 0? this.matchs[this.matchs.length -1].roomId + 1:1

            const newMatchData = {
                gamedata: generateEmptyGamedata(),
                inPlaying: playerId,
                players: [
                    {
                        id: playerId,
                        username: playerName,
                        symbol: 'O'
                    }
                ],
                roomId: newMatchId
            } as matchInterface

            this.matchs.push(newMatchData)

            socket.join(newMatchId)
            this.socketClient.to(newMatchId).emit('changeGamedata', newMatchData)

        }

        socket.on('disconnect', () => {
            this.handleDesconnect(socket)
        })

        socket.on('move', (data:handleMoveDataInterface) =>  {
            this.handleMove(data, socket)
        })

        
    }

    addNewWinAPlayer = (winnerId?: string) => {

        if(!winnerId){
            return
        }

        const winnerPlayerInPlayers = this.players.filter((player) => {
            return player.userid === winnerId
        })

        if(winnerPlayerInPlayers.length === 0){
            return
        }

        const winnerPlayerIndexInPlayers = this.players.indexOf(winnerPlayerInPlayers[0])

        this.players[winnerPlayerIndexInPlayers].wins = this.players[winnerPlayerIndexInPlayers].wins + 1

        if(this.players[winnerPlayerIndexInPlayers].wins >= this.rank.second.wins){

            this.rank.second.id = winnerId
            this.rank.second.username = winnerPlayerInPlayers[0].username
            this.rank.second.wins = this.players[winnerPlayerIndexInPlayers].wins
            
            if(this.rank.first.wins < this.rank.second.wins){

                const latestFirst = {...this.rank.first}
                const latestSecond = {...this.rank.second}
                
                this.rank.first = latestSecond
                this.rank.second = latestFirst

            }

            this.socketClient.emit('rank', this.rank)

        }

    }

    handleDesconnect = (socket:any) => {

        const desconnectedPlayerId = socket.id
        const desconnectedPlayerName = socket.handshake.query.nickname

        if(!desconnectedPlayerName){
            return
        }

        const desconnectedPlayerInPlayers = this.players.filter((player) => {
            return player.userid === desconnectedPlayerId
        })

        if(desconnectedPlayerInPlayers.length === 0){
            return
        }

        const deconnectedPlayerIndex = this.players.indexOf(desconnectedPlayerInPlayers[0])
        this.players.splice(deconnectedPlayerIndex, 1)

        const matchsWithDesconnectedPlayer = this.matchs.filter((match) => {
            return match.players.filter((player) => {
                player.id === desconnectedPlayerId
            })
        })

        if(matchsWithDesconnectedPlayer.length === 0){
            return
        }

        const match = matchsWithDesconnectedPlayer[0]
        const matchIndexInMatchsIndex = this.matchs.indexOf(match)

        if(match.players.length === 1){
            return this.matchs.splice(matchIndexInMatchsIndex, 1)
        }else{

            const winner = match.players.filter((player) => {
                return player.id !== desconnectedPlayerId
            })[0]

            this.addNewWinAPlayer(winner?.id)

            this.socketClient.to(match.roomId).emit('win', {
                winnerId: winner?.id
            })

            this.matchs.splice(matchIndexInMatchsIndex, 1)

            const matchsAwaitingPlayers = this.matchs.filter(match => {
                return match.players.length == 1
            })

            if(matchsAwaitingPlayers.length > 0){ //Has one or more matches with only one player
                
                const matchAwaitingPlayersIndex = this.matchs.indexOf(matchsAwaitingPlayers[0])
    
                this.matchs[matchAwaitingPlayersIndex].players.push({
                    id: winner.id,
                    symbol: 'X',
                    username: winner.username
                })
    
                socket.join(this.matchs[matchAwaitingPlayersIndex].roomId)
                this.socketClient.to(this.matchs[matchAwaitingPlayersIndex].roomId).emit('changeGamedata', this.matchs[matchAwaitingPlayersIndex])
    
    
            }else{

                const matchId = this.matchs.length > 0? this.matchs[this.matchs.length -1].roomId + 1:1
            
                const newMatchData = {
                    gamedata: generateEmptyGamedata(),
                    inPlaying: winner?.id,
                    players: [
                        {
                            id: winner.id,
                            username: winner.username,
                            symbol: 'O'
                        }
                    ],
                    roomId: matchId
                } as matchInterface
    
                socket.join(matchId)
                this.socketClient.to(matchId).emit('changeGamedata', newMatchData)
    
                this.matchs.push(newMatchData)
    
    
            }

        }

    }

    handleMove = (data:handleMoveDataInterface, socket:any) => {


        if(!data.index && data.index !== 0){
            return
        }

        const movePlayerId = socket.id
        const movePlayerName = socket.handshake.query.nickname

        if(!movePlayerName){
            return
        }

        const matchsWithMovePlayer = this.matchs.filter((match) => {
            return match.players.filter((player) => {
                player.id === movePlayerName
            })
        })

        if(matchsWithMovePlayer.length === 0){
            return
        }

        const match = matchsWithMovePlayer[0]

        if(match.players.length <= 1){
            return
        }

        if(match.inPlaying !== movePlayerId){
            return
        }

        if(match.gamedata[data.index].value !== 'empty'){
            return
        }


        const matchIndexInMatchsData = this.matchs.indexOf(match)

        const playerInMatch = match.players.filter((player) => {
            return player.id === movePlayerId
        })[0]

        this.matchs[matchIndexInMatchsData].gamedata[data.index].value = playerInMatch.symbol


        this.matchs[matchIndexInMatchsData].inPlaying =
            match.inPlaying === match.players[0].id? match.players[1].id:match.players[0].id 

        this.socketClient.to(match.roomId).emit('changeGamedata', this.matchs[matchIndexInMatchsData])

        this.hasWinner(this.matchs[matchIndexInMatchsData])

    }



}

export default GameControllers