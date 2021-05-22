import {useContext, useState} from 'react'

//Icons
import {AiOutlineCheck} from 'react-icons/ai' 

//Contexts
import GameContext from '../../Contexts/GameContext'

const styles = require('./Styles.module.scss')

export default function GamePainel(){

    const {
        addNickname,
        circleName,
        crossName,
        rank,
        resetScore,
        restartMatch,
        playing,
        changeGamemode,
        gamemode,
        mySymbol
    } = useContext(GameContext)

    const [nickname, setNickname] = useState<string>('')

    const handleSubmitAddNickname = (event:any) => {

        event.preventDefault()

        if(!circleName){
            addNickname('O', nickname)
        }else if(!crossName){
            addNickname('X', nickname)
        }

        return setNickname('')

    }


    return(
        <section className={styles.gamePanelContainer}>
            <h1>
                TicTacToe
            </h1>

            <div className={styles.gamemodeSelectorContainer}>
                <h2>Game mode:</h2>
                <div>
                    <button
                        onClick={() => {changeGamemode('multiplayer')}}
                        className={gamemode === 'multiplayer'&&styles.selectedGamemodeButton}
                    >
                        Multiplayer
                    </button>
                    <button
                        onClick={() => {changeGamemode('local')}}
                        className={gamemode === 'local' &&styles.selectedGamemodeButton}

                    >
                        Local
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmitAddNickname} className={styles.nickContainer}>
                <h1>
                    {
                        gamemode === 'local'? (
                            circleName && crossName? 'You need reset score to edit some nickname!' : (
                                <>
                                    Nickname for
                                    {
                                        !circleName?  ' circle ':(
                                            <>
                                                {
                                                    !crossName? ' cross ':null
                                                }
                                            </>
                                        )
                                    }
                                    player
                                </>
                            )
                        ) : (
                            circleName? 'You need to switch the game mode to local and then multiplayer again to edit your nickname':'Your nickname'
                        )
                    }
                </h1>

                <div>
                    <input 
                        type="text"
                        placeholder="Nick"
                        maxLength={20}
                        onChange={(e) => setNickname(e.target.value)}
                        disabled={
                            gamemode === 'multiplayer'? (
                                circleName? true:false
                            ):(
                                circleName && crossName?true:false
                            )
                        }
                        value={nickname}
                    />
                    <button
                        disabled={
                            gamemode === 'multiplayer'? (
                                circleName? true:false
                            ):(
                                circleName && crossName?true:false
                            )
                        }
                    >
                        <AiOutlineCheck
                            size="1.5rem"
                            color="#014431"

                        />
                    </button>
                </div>
            </form>

            <div className={styles.gameOptionsButtonsContainer}>
                <button onClick={restartMatch}>
                    {
                        gamemode === 'multiplayer'?'Give up the ':'Restart '
                    }
                    match</button>
                <button disabled={gamemode==='multiplayer'} onClick={resetScore}>Reset score</button>
            </div>

            <div className={styles.playingNowContainer}>
                <h2>Playing now:</h2>
                <div>
                    <div className={playing === 'X'? styles.playingNow:null}>
                        <h1>X</h1>
                        <h2>{crossName}</h2>
                        <h3>{
                            gamemode === 'local'? null: mySymbol === 'X'? 'You':'Opponent'
                        }</h3>
                    </div>
                    <div className={playing === 'O'? styles.playingNow:null}>
                        <h1>O</h1>
                        <h2>{circleName}</h2>
                        <h3>{
                            gamemode === 'local'? null:mySymbol === 'O'? 'You':'Opponent'
                        }</h3>
                    </div>
                </div>
            </div>

            <table cellSpacing={10} className={styles.rankingContainer}>

                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Symbol</th>
                        <th>Wins</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>{rank.first.username}</td>
                        <td>{rank.first.symbol}</td>
                        <td>{rank.first.wins}</td>
                    </tr>
                    <tr>
                        <td>{rank.second.username}</td>
                        <td>{rank.second.symbol}</td>
                        <td>{rank.second.wins}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    )
}