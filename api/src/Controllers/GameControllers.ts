//Types
import {rankInterface, playerInterface, matchInterface} from '../Types/GameTypes' 

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
            wins:0
        }
    } as rankInterface

    matchs = [] as matchInterface[]

    handleNewConnection = (socket:any) => {

        const playerId = socket.id
        const playerName = socket.handshake.query.nickname
    

        if(!playerName){
            return
        }

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

            const matchId = this.matchs.length > 0? this.matchs[this.matchs.length -1].roomId + 1:1

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
                roomId: matchId
            } as matchInterface

            socket.join(matchId)

            this.matchs.push(newMatchData)


        }

        socket.on('disconnect', () => {
            this.handleDesconnect(socket)
        })

        
    }

    addNewWinAPlayer = (winnerId?: string) => {

        if(!winnerId){
            return
        }
    }

    handleDesconnect = (socket:any) => {

        const desconnectedPlayerId = socket.id
        const desconnectedPlayerName = socket.handshake.query.nickname

        if(!desconnectedPlayerName){
            return
        }

        const matchsWithDesconnectedPlayer = this.matchs.filter((match) => {
            return match.players.filter((player) => {
                player.id === desconnectedPlayerId
            })
        })


        if(matchsWithDesconnectedPlayer.length > 0){
            
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
                                id: winner?.id,
                                username: winner?.id,
                                symbol: 'O'
                            }
                        ],
                        roomId: matchId
                    } as matchInterface
        
                    socket.join(matchId)
        
                    this.matchs.push(newMatchData)
        
        
                }

            }

        }else{
            return
        }
    }



}

export default GameControllers