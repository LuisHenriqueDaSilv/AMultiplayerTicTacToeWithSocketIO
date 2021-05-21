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
    gamemode: 'multiplayer'| 'local'
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