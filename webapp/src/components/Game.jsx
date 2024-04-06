import React, { useState, useEffect } from 'react';
import { PostGame } from './PostGame';
import Question from './Question';
import { Typography } from '@mui/material';

export const Game = ({ gameMode }) => {
    const [gameState, setGameState] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);

    const [category, setCategory] = useState("general");
    const [restart, setRestart] = useState(false);

    const changeCategory = (category) => {
        setCategory(category);
        setRestart(!restart);
        goTo(0);
    }

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
            <main className='preguntas'>
                { gameState === 0 && gameMode === "category" ?
                    <Typography sx={{ fontSize:'1.6em', marginBottom:'0.3em !important', paddingTop:'1em', textAlign:'center' }}>
                        Restart game with a new category</Typography>
                :""}
                { gameState === 1 && gameMode === "category" ?
                    <Typography sx={{ fontSize:'1.6em', marginBottom:'0.3em !important' }}>
                        Choose a category for a new game</Typography>
                :""}
            { gameMode === "category" ?
                <div className='questionCategory'>
                    <button className={category === "general" ? 'questionCategoryMarked' : ''} onClick={() => changeCategory("general")}>
                        All Categories</button>
                    <button className={category === "art" ? 'questionCategoryMarked' : ''} onClick={() => changeCategory("art")}>
                        Art</button>
                    <button className={category === "sports" ? 'questionCategoryMarked' : ''} onClick={() => changeCategory("sports")}>
                        Sports</button>
                    <button className={category === "entertainment" ? 'questionCategoryMarked' : ''} onClick={() => changeCategory("entertainment")}>
                        Entertainment</button>
                    <button className={category === "geography" ? 'questionCategoryMarked' : ''} onClick={() => changeCategory("geography")}>
                        Geography</button>
                    <button className={category === "planets" ? 'questionCategoryMarked' : ''} onClick={() => changeCategory("planets")}>
                        Planets</button>
                </div>
                : ""}
            {gameState === 0 && <Question goTo={(x) => goTo(x)} setGameFinished={setGameFinished} 
                                        gameMode={gameMode} category={category} key={restart.toString()} restart={restart}/>}
            {gameState === 1 && <PostGame gameMode={gameMode}/>}
            </main>
        </>
    );
};
