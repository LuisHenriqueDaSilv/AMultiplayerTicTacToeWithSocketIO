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
        playing
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

            <form onSubmit={handleSubmitAddNickname} className={styles.nickContainer}>
                <h1>
                    {
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
                    }
                </h1>

                <div>
                    <input 
                        type="text"
                        placeholder="Nick"
                        maxLength={20}
                        onChange={(e) => setNickname(e.target.value)}
                        disabled={circleName && crossName? true: false}
                        value={nickname}
                    />
                    <button>
                        <AiOutlineCheck
                            size="1.5rem"
                            color="#014431"
                        />
                    </button>
                </div>
            </form>

            <div className={styles.gameOptionsButtonsContainer}>
                <button onClick={restartMatch}>Restart match</button>
                <button onClick={resetScore}>Reset score</button>
            </div>

            <div className={styles.playingNowContainer}>
                <h2>Playing now:</h2>
                <div>
                    <h2 className={playing === 'X'? styles.playingNow:null}>X</h2>
                    <h2 className={playing === 'O'? styles.playingNow:null}>O</h2>
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