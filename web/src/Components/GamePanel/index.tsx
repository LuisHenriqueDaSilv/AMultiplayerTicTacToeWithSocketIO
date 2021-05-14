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

            <div className={styles.gamemodeButtonsContainer}>
                <button className={styles.selectedMode}>Offline</button>
                <button>Online</button>
            </div>

            <table cellSpacing={10} className={styles.rankingContainer}>

                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Vitorias</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Luis SilvaaaaaaLuis Silvaaaaaa</td>
                        <td>15</td>
                    </tr>
                    <tr>
                        <td>Undefined</td>
                        <td>12</td>
                    </tr>
                    <tr>
                        <td>Undefined</td>
                        <td>5</td>
                    </tr>
                </tbody>
            </table>

        </section>
    )
}