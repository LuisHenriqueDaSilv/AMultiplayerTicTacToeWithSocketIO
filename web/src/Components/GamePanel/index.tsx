//Icons
import {AiOutlineCheck} from 'react-icons/ai' 


const styles = require('./Styles.module.scss')

export default function GamePainel(){
    return(
        <section className={styles.gamePanelContainer}>
            <h1>
                TicTacToe
            </h1>

            <form onSubmit={(event) => {event.preventDefault(); alert('submit')}} className={styles.nickContainer}>
            
                <input 
                    type="text"
                    placeholder="Nick"
                    maxLength={20}
                />
                <button>
                    <AiOutlineCheck
                        size="1.5rem"
                        color="#014431"
                    />
                </button>
            </form>

            <div className={styles.gameOptionsButtonsContainer}>
                <button>Restart match</button>
                <button>Reset score</button>
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
                        <td>LuisSilva</td>
                        <td>Cross</td>
                        <td>15</td>
                    </tr>
                    <tr>
                        <td>Teste</td>
                        <td>Circle</td>
                        <td>12</td>
                    </tr>
                </tbody>
            </table>

        </section>
    )
}