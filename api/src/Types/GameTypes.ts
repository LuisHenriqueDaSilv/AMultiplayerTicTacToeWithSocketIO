export interface rankInterface {
    first: {
        username: string,
        symbol: 'N/A',
        wins: number,
        id: string | null
    },
    second: {
        username: string,
        symbol: 'N/A',
        wins: number,
        id: string | null
    }
}

export interface matchInterface {
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

export interface handleMoveDataInterface{
    index: number
}

export interface playerInterface {
    userid: string,
    wins: number,
    username: string
}