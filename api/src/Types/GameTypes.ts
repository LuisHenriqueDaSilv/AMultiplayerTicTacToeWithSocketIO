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

export interface playerInterface {
    wins: number,
    username: string,
    id: string,
}

export interface matchInterface {
    gamedata: [
        {
            id: number,
            value: 'X'| 'O'| 'empty'
        }
    ],
    players: [
        {
            username: string,
            id: string,
            symbol: 'X'| 'O'
        }
    ],
    roomId: number,
    inPlaying: string
}