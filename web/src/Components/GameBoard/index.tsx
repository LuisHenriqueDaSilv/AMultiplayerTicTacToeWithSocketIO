import {useContext} from 'react'

import GameContext from '../../Contexts/GameContext'

const styles = require('./Styles.module.scss')

export default function GameBoard(){
    
    const {gamedata, handleMove} = useContext(GameContext)

    return(
        <section className={styles.gameBoardContainer}>
            {
                gamedata.map((data) => {
                    return(
                        <button onClick={()=> {handleMove(data.id)}} key={data.id}>
                            {
                                data.value === 'empty'? null:data.value
                            }
                            <h2>
                                {data.id}
                            </h2>
                        </button>
                    )
                })
            }
        </section>
    )
}