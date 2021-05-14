const styles = require('./Styles.module.scss')

export default function GameBoard(){
    return(
        <section className={styles.gameBoardContainer}>
            <button>
                X
            </button>
            <button>
                O
            </button>
            <button>
                O
            </button>
            <button>
                X
            </button>
            <button/>
            <button/>
            <button/>
            <button/>
            <button/>
        </section>
    )
}