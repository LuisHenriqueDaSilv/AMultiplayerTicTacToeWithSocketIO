export default function generateEmptyGamedata(){

    const newGamedata = []

    for(var counter = 0; counter < 9; counter++ ){
        newGamedata.push({
            id: counter,
            value: 'empty'
        })
    }

    return newGamedata

}