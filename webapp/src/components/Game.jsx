import React, { useState, useEffect } from 'react';
import { PostGame } from './PostGame';
import Question from './Question';

export const Game = ({ gameMode }) => {
    const [gameState, setGameState] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);

    const goTo = (parameter) => {
        setGameState(parameter);
    };

    useEffect(() => {
        if (gameFinished) {
            setGameState(1); // Cambia el estado después de que Question termine de renderizarse
        }
    }, [gameFinished]);

    return (
        <>
            {gameState === 0 && <Question goTo={(x) => goTo(x)} setGameFinished={setGameFinished} gameMode={gameMode}/>}
            {gameState === 1 && <PostGame />}
        </>
    );
};
