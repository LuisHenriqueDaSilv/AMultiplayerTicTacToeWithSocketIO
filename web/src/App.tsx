import React from 'react';

//Components
import GameBoard from './Components/GameBoard';
import GamePainel from './Components/GamePanel';

const styles = require('./Styles/App.module.scss')



export default function App() {

    return (
            <div className={styles.AppContainer}>

                <GameBoard/>

                <GamePainel/>

            </div>
    );
}

