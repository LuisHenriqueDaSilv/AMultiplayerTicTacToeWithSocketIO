import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//Global Styles
import './Styles/Global.css'

//Contexts providers
import {GameContextProvider} from './Contexts/GameContext'

ReactDOM.render(
    <GameContextProvider>
        <App />
    </GameContextProvider>,
    document.getElementById('root')
);

