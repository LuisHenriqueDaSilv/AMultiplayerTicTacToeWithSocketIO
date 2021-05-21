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
    awaitingMatch: boolean
}

export interface rankCell {
    id: string | null,
    username: string,
    wins: number,
    symbol: 'N/A'
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
            id: string
        },
        {
            username: string,
            id: string
        },
    ],
    roomId: string
}

export interface gamedataInterface {
    id: number,
    value: 'X'| 'O'| 'empty'
}

export interface gamePlayerCell{
    username: string,
    id: string
}