export interface GameDataInterface{
    id: number,
    value: 'X'|'empty'|'O'
}

export interface RankInterface{
    first: {
        username: string,
        symbol: 'X'| 'O' |'N/A',
        wins: number
    },
    second: {
        username: string,
        symbol: 'X'| 'O'| 'N/A',
        wins: number
    }
}

export interface ContextDataInterface{
    crossName: string,
    circleName: string,
    playing: 'O'| 'X',
    winPositions: number[]| null,
    gamemode: 'multiplayer'| 'local',
    areAwaitingplayer: boolean,
    itsMyTurn: boolean,
    onlineName: string,
    mySymbol: 'X'| 'O',
    restartMatch: () => void,
    resetScore: () => void,
    changeGamemode: (gamemode: 'multiplayer'| 'local') => void,
    handleMove: (positionId:number) => void,
    addNickname: (symbol: 'X'|'O', nick:string) => void,
    gamedata: [
        {
            id: number,
            value: 'X'|'empty'|'O' 
        }
    ]
    rank: {
        first: {
            username: string,
            symbol: 'X'| 'O' |'N/A',
            wins: number
        },
        second: {
            username: string,
            symbol: 'X'| 'O'| 'N/A',
            wins: number
        }
    }
}

export interface onlineMatchInterface {
    gamedata: [
        {
            id: number,
            value: 'X'| 'O'| 'empty'
        }
    ],
    players: {
        username: string,
        id: string,
        symbol: 'X'| 'O'
    }[],
    roomId: number,
    inPlaying: string
}

export interface gameEndDataInterface {
    win: string | false,
    tie: boolean,
    winner: string | null,
    positions: [number]| null
}