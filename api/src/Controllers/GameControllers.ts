//Types
import {rankInterface, playerInterface, rankCell, matchInterface, gamePlayerCell} from '../Types/GameTypes' 

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

    players = [

    ] as playerInterface[]

    matchs = [] as matchInterface[]

    handleRankChange = (socket:any) => {

        let first:any = {
            id: null,
            username: 'N/A',
            wins: 0
        } as rankCell

        let second = {
            id: null,
            username: 'N/A',
            wins: 0
        } as rankCell

        this.players.map((player:playerInterface) => {

            if(player.wins > second.wins){
                second = {
                    id: player.id,
                    username: player.username,
                    wins: player.wins,
                    symbol: 'N/A'
                }
            }

            if(player.wins > first.wins){

                second = first

                first = {
                    id: player.id,
                    username: player.username,
                    wins: player.wins
                }

            }

        })

        this.rank.first = first
        this.rank.second = second as rankCell


        this.socketClient.emit('rank', this.rank)
    }

    addWinInPlayer = (playerId:string, socket:any) => {
        
    }

    handleDesconnect = (socket:any) => {
        const desconnectedPlayerId = socket.id
        const desconnectedPlayerName = socket.handshake.query.nickname

        if(!desconnectedPlayerName){return}

        const matchsWithLeavePlayer = this.matchs.filter((match) => {
            return match.players.filter((player) => {
                return player.id === desconnectedPlayerId
            })
        })

        if(matchsWithLeavePlayer.length > 0){

            const matchIndex = this.matchs.indexOf(matchsWithLeavePlayer[0])

            const winnerPlayer = this.matchs[matchIndex].players.filter((player) => {
                return player.id !== desconnectedPlayerId
            })[0]


            socket.to(this.matchs[matchIndex].roomId).emit('win', {
                winnnerId: winnerPlayer.id
            })

            this.addWinInPlayer(winnerPlayer.id, socket)

            this.matchs.splice(matchIndex, 1)
        }

        const desconnectedPlayer = this.players.filter((player) => {
            return player.id === desconnectedPlayerId
        })[0]

        const desconnectedPlayerIndex = this.players.indexOf(desconnectedPlayer)

        if(desconnectedPlayerIndex > 0){
            this.players.splice(desconnectedPlayerIndex, 1)
        }
    }

    handleNewConnection = (socket:any) => {

        const playerId = socket.id
        const playerName = socket.handshake.query.nickname
    

        if(!playerName){
            return
        }

        const awaitMatchPlayers = this.players.filter((player) => {
            return player.awaitingMatch
        })

        if(awaitMatchPlayers.length === 0){
            this.players.push({
                awaitingMatch: true,
                id: playerId,
                username: playerName,
                wins: 0
            })
        }else{

            const oponentIndex = this.players.indexOf(awaitMatchPlayers[0])

            if(oponentIndex > 0){

                this.players[oponentIndex].awaitingMatch = false
                const oponent = this.players[oponentIndex]


                this.players.push({
                    awaitingMatch: false,
                    id: playerId,
                    username: playerName,
                    wins: 0
                })

                this.matchs.push({
                    gamedata: [{value: 'X', id: 0}],
                    players: [
                        {
                            id: playerId as string,
                            username: playerName as string
                        }, 
                        {
                            id: oponent.id as string,
                            username: oponent.username as string
                        },
                    ],
                    roomId: `${oponent.id}++${playerId}`
                })
            }
        }
        
        socket.on('disconnect', () => {this.handleDesconnect(socket)})

        console.log(`Player connected: ${playerId}|||${playerName}`)
        
    }
}

export default GameControllers