import {useContext} from 'react'

import GameContext from '../../Contexts/GameContext'

const styles = require('./Styles.module.scss')

export default function GameBoard(){
    
    const {
        gamedata,
        handleMove,
        winPositions,
        gamemode,
        circleName,
        areAwaitingplayer,
        itsMyTurn
    } = useContext(GameContext)

    return(
        <section className={styles.gameBoardContainer}>
            {
                gamemode === 'multiplayer' && !circleName? (
                    <div className={styles.errorContainer}>
                        <h1>You need add your nick in game panel to play in a server</h1>
                    </div>
                ): (
                    areAwaitingplayer? (
                        <div className={styles.errorContainer}>
                            <h1>await oponent</h1>
                        </div>
                    ): (
                        <div className={styles.gameButtonsContainer}>
                            {
                                gamedata.map((data) => {
                                    return(
                                        <button
                                            className={
                                                gamemode === 'local'? null: (
                                                    itsMyTurn? null:styles.blockedButton
                                                )
                                            }
                                            onClick={()=> {handleMove(data.id)}}
                                            key={data.id}
                                            
                                        >
                                            {
                                                data.value === 'empty'? null:(
                                                    <strong className={winPositions?.includes(data.id)?styles.winPosition:null}>{data.value}</strong>
                                                )
                                            }
                                            <h2 
                                            >
                                                {data.id}
                                            </h2>
                                        </button>
                                    )
                                })
                            }
                        </div>
                    )
                )
            }
        </section>
    )
}